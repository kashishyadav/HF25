"""
How to run and test: (Right now it is done via an in memory database)
cd engtosql
python engsql.py --demo --q "how many orders in 2024?" --run
python engsql.py --demo --q "count of orders by status" --run
python engsql.py --demo --q "select name, email from customers where email contains 'example' limit 3" --run
python engsql.py --demo --q "top 2 customers by total_spent" --run
python engsql.py --demo --inspect
"""

from __future__ import annotations
import argparse, re, sqlite3
from typing import Dict, List, Tuple, Optional

DEMO_URI = "file:engsql_demo?mode=memory&cache=shared"
DEMO_CONN: Optional[sqlite3.Connection] = None

DEMO_SCHEMA_SQL = """
CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name TEXT,
  email TEXT,
  total_spent REAL,
  created_at TEXT
);
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  amount REAL,
  status TEXT,
  order_date TEXT
);
"""

DEMO_DATA_SQL = """
INSERT INTO customers (name, email, total_spent, created_at) VALUES
  ('Alice', 'alice@example.com', 420.50, '2024-01-02'),
  ('Bob',   'bob@example.com',   180.00, '2023-06-10'),
  ('Cara',  'cara@acme.co',      950.75, '2024-03-18'),
  ('Dev',   'dev@devs.dev',      75.00,  '2022-11-05');

INSERT INTO orders (customer_id, amount, status, order_date) VALUES
  (1, 50.00,  'shipped',  '2024-03-10'),
  (1, 120.50, 'shipped',  '2024-06-05'),
  (2, 180.00, 'pending',  '2023-07-01'),
  (3, 500.25, 'shipped',  '2024-04-22'),
  (3, 450.50, 'refunded', '2024-07-30'),
  (4, 75.00,  'cancelled','2022-12-01');
"""

def init_demo_db() -> None:
    """Create demo schema+data in a shared in-memory DB and KEEP the connection open."""
    global DEMO_CONN
    if DEMO_CONN is not None:
        return
    DEMO_CONN = sqlite3.connect(DEMO_URI, uri=True, check_same_thread=False)
    cur = DEMO_CONN.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='customers'"
    )
    if cur.fetchone() is None:
        DEMO_CONN.executescript(DEMO_SCHEMA_SQL)
        DEMO_CONN.executescript(DEMO_DATA_SQL)
        DEMO_CONN.commit()

def _connect(db_path: str) -> sqlite3.Connection:
    """Route connections: use the persistent demo connection when db_path is DEMO_URI."""
    if db_path == DEMO_URI and DEMO_CONN is not None:
        return sqlite3.connect(DEMO_URI, uri=True, check_same_thread=False)
    return sqlite3.connect(db_path, uri=db_path.startswith("file:"), check_same_thread=False)

def _get_conn_for_readonly_ops(db_path: str) -> sqlite3.Connection:
    """For schema/reads, prefer using the already-open DEMO_CONN if applicable."""
    if db_path == DEMO_URI and DEMO_CONN is not None:
        return sqlite3.connect(DEMO_URI, uri=True, check_same_thread=False)
    return sqlite3.connect(db_path, uri=db_path.startswith("file:"), check_same_thread=False)

def inspect_schema(db_path: str) -> Dict[str, List[Tuple[str, str]]]:
    """Return {table: [(col, type), ...]} for SQLite DB at path/URI."""
    conn = _get_conn_for_readonly_ops(db_path)
    try:
        cur = conn.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
        )
        tables = [r[0] for r in cur.fetchall()]
        out: Dict[str, List[Tuple[str, str]]] = {}
        for t in tables:
            cols = conn.execute(f"PRAGMA table_info({t})").fetchall()
            out[t] = [(c[1], c[2]) for c in cols]
        return out
    finally:
        conn.close()

def simple_schema(db_path: str) -> Dict[str, List[str]]:
    raw = inspect_schema(db_path)
    return {t: [c for c, _ in cols] for t, cols in raw.items()}

OPS_MAP = {
    "=": ["=", "is", "equals", "equal to"],
    ">": [">", "greater than", "after", "newer than", "more than"],
    "<": ["<", "less than", "before", "earlier than"],
    ">=": [">=", "at least", "no less than"],
    "<=": ["<=", "at most", "no more than"],
}
WORD_TO_OP = {w: op for op, words in OPS_MAP.items() for w in set(words)}

def norm(text: str) -> str: return " ".join(text.lower().strip().split())

def extract_year(text: str) -> Optional[str]:
    m = re.search(r"(19|20)\d{2}", text)
    return m.group(0) if m else None

class EngSQL:
    def __init__(self, db_path: str, dialect: str = "sqlite"):
        self.db_path = db_path
        self.dialect = dialect
        self.schema = simple_schema(db_path)

    def to_sql(self, question: str) -> Tuple[str, List[object]]:
        q = question.strip()
        for builder in (
            self._p_count_by,
            self._p_count,
            self._p_topn_by,
            self._p_agg,
            self._p_select_like,
            self._p_fallback_table,
        ):
            res = builder(q)
            if res:
                return res
        raise ValueError("Could not parse question; try a simpler phrasing.")

    def run(self, sql: str, params: List[object]) -> List[sqlite3.Row]:
        conn = _connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            cur = conn.execute(sql, params)
            return cur.fetchall()
        finally:
            conn.close()

    def _p_count(self, q: str):
        m = re.match(r"^(how many|count(?: of)?)\s+(?P<table>[a-z_][a-z0-9_]*)(?P<rest>.*)$", q, re.I)
        if not m: return None
        table, rest = m.group("table"), m.group("rest")
        if table not in self.schema: return None
        where_sql, params = self._parse_where(rest, self.schema[table])
        return f"SELECT COUNT(*) AS count FROM {table}{where_sql}", params

    def _p_topn_by(self, q: str):
        m = re.match(r"^(top|lowest)\s+(?P<n>\d+)\s+(?P<table>[a-z_][a-z0-9_]*)\s+by\s+(?P<col>[a-z_][a-z0-9_]*)", q, re.I)
        if not m: return None
        order = "DESC" if m.group(1).lower() == "top" else "ASC"
        n = int(m.group("n")); table, col = m.group("table"), m.group("col")
        if table not in self.schema or col not in self.schema[table]: return None
        return f"SELECT * FROM {table} ORDER BY {col} {order} LIMIT ?", [n]

    def _p_agg(self, q: str):
        m = re.match(r"^(sum|avg|average|min|max)\s+of\s+(?P<col>[a-z_][a-z0-9_]*)\s+(?:from|in)\s+(?P<table>[a-z_][a-z0-9_]*)\b(?P<rest>.*)$", q, re.I)
        if not m: return None
        func = m.group(1).upper(); func = "AVG" if func == "AVERAGE" else func
        col, table, rest = m.group("col"), m.group("table"), m.group("rest")
        if table not in self.schema or col not in self.schema[table]: return None
        grp = None
        g = re.search(r"\bby\s+(?P<grp>[a-z_][a-z0-9_]*)", rest, re.I)
        if g and g.group("grp") in self.schema[table]: grp = g.group("grp")
        where_part = re.split(r"\bby\b", rest, 1, flags=re.I)[0]
        where_sql, params = self._parse_where(where_part, self.schema[table])
        if grp:
            sql = f"SELECT {grp}, {func}({col}) AS value FROM {table}{where_sql} GROUP BY {grp} ORDER BY value DESC"
        else:
            sql = f"SELECT {func}({col}) AS value FROM {table}{where_sql}"
        return sql, params

    def _p_select_like(self, q: str):
        m = re.match(r"^(select|show|list|get)\s+(?P<cols>.+?)\s+(?:from|in)\s+(?P<table>[a-z_][a-z0-9_]*)(?P<rest>.*)$", q, re.I)
        if not m: return None
        table = m.group("table")
        if table not in self.schema: return None
        cols_text = m.group("cols").strip()
        if cols_text in ("*", "all"):
            cols = ["*"]
        else:
            cols = [c.strip().lower() for c in re.split(r",| and ", cols_text)]
            for c in cols:
                if c != "*" and c not in self.schema[table]: return None
        where_sql, params = self._parse_where(m.group("rest"), self.schema[table])
        order_sql, limit_sql, extra = self._parse_order_limit(m.group("rest"), self.schema[table])
        return f"SELECT {', '.join(cols)} FROM {table}{where_sql}{order_sql}{limit_sql}", params + extra

    def _p_count_by(self, q: str):
        m = re.match(r"^count of\s+(?P<table>[a-z_][a-z0-9_]*)\s+by\s+(?P<col>[a-z_][a-z0-9_]*)$", q, re.I)
        if not m: return None
        table, col = m.group("table"), m.group("col")
        if table not in self.schema or col not in self.schema[table]: return None
        return f"SELECT {col}, COUNT(*) AS count FROM {table} GROUP BY {col} ORDER BY count DESC", []

    def _p_fallback_table(self, q: str):
        toks = norm(q).split()
        for t in self.schema:
            if t in toks: return f"SELECT * FROM {t}", []
        return None

    def _parse_where(self, rest: str, columns: List[str]) -> Tuple[str, List[object]]:
        if not rest: return "", []
        text = norm(rest); params: List[object] = []; clauses: List[str] = []
        y = extract_year(text)
        if y:
            date_cols = [c for c in columns if any(x in c for x in ("date", "time", "created", "updated"))]
            if date_cols:
                dc = date_cols[0]
                clauses.append(f"strftime('%Y', {dc}) = ?")
                params.append(y)
        m = re.search(r"\bwhere\s+(.+)$", text); cond_text = m.group(1) if m else text
        m2 = re.search(r"(\b[a-z_][a-z0-9_]*\b)\s+(contains|like)\s+'?([\w\s%._-]+)'?", cond_text)
        if m2:
            col, _, val = m2.groups()
            if col in columns: clauses.append(f"{col} LIKE ?"); params.append(f"%{val}%")
        m3 = re.search(r"(\b[a-z_][a-z0-9_]*\b)\s+(starts with)\s+'?([\w\s%._-]+)'?", cond_text)
        if m3:
            col, _, val = m3.groups()
            if col in columns: clauses.append(f"{col} LIKE ?"); params.append(f"{val}%")
        for word in sorted(WORD_TO_OP.keys(), key=len, reverse=True):
            op = WORD_TO_OP[word]
            pat = re.compile(rf"(\b[a-z_][a-z0-9_]*\b)\s+{re.escape(word)}\s+'?([-\w.:%\s]+)'?")
            m4 = pat.search(cond_text)
            if m4:
                col, val = m4.groups()
                if col in columns: clauses.append(f"{col} {op} ?"); params.append(val.strip())
        if not clauses: return "", []
        return " WHERE " + " AND ".join(dict.fromkeys(clauses)), params

    def _parse_order_limit(self, rest: str, columns: List[str]) -> Tuple[str, str, List[object]]:
        text = norm(rest); order_sql = ""; limit_sql = ""; params: List[object] = []
        om = re.search(r"\bby\s+(\b[a-z_][a-z0-9_]*\b)", text)
        if om:
            col = om.group(1)
            if col in columns:
                direction = "DESC" if ("top" in text or "highest" in text) else ("ASC" if "lowest" in text else "ASC")
                order_sql = f" ORDER BY {col} {direction}"
        lm = re.search(r"\blimit\s+(\d+)\b", text)
        if lm:
            limit_sql = " LIMIT ?"; params.append(int(lm.group(1)))
        return order_sql, limit_sql, params

def main():
    p = argparse.ArgumentParser(description="English → SQL (SQLite) translator (one-file)")
    p.add_argument("--db", help="Path to SQLite .db file (or URI). If omitted with --demo, uses in-memory demo.")
    p.add_argument("--demo", action="store_true", help="Use built-in shared in-memory demo DB")
    p.add_argument("--q", help='English query, e.g. "how many orders in 2024?"')
    p.add_argument("--run", action="store_true", help="Execute the SQL and print results")
    p.add_argument("--inspect", action="store_true", help="Print detected schema and exit")
    args = p.parse_args()
    if args.demo:
        init_demo_db()
        db_path = DEMO_URI
    else:
        if not args.db:
            p.error("--db is required unless --demo is used")
        db_path = args.db

    if args.inspect:
        for t, cols in inspect_schema(db_path).items():
            print(f"\nTable: {t}")
            for c, tp in cols: print(f"  - {c} ({tp})")
        return

    if not args.q:
        p.error("--q is required unless --inspect is used")

    eng = EngSQL(db_path)
    sql, params = eng.to_sql(args.q)
    print("SQL:", sql)
    print("Params:", params)
    if args.run:
        rows = eng.run(sql, params)
        if rows:
            headers = rows[0].keys()
            print("Result:")
            print("| " + " | ".join(headers) + " |")
            print("| " + " | ".join(["---"] * len(headers)) + " |")
            for r in rows:
                print("| " + " | ".join(str(v) for v in r) + " |")
        else:
            print("Result: (no rows)")

if __name__ == "__main__":
    main()