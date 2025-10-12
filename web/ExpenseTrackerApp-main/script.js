let expenses = [];
let totalExpenses = 0;

function addExpense() {
    const description = document.getElementById("expense-description").value;
    const amount = parseFloat(document.getElementById("expense-amount").value);

    if (!description || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid description and amount.");
        return;
    }

    expenses.push({ description, amount });
    totalExpenses += amount;

    updateUI();
}

function deleteExpense(index) {
    totalExpenses -= expenses[index].amount;
    expenses.splice(index, 1);
    updateUI();
}

function updateUI() {
    const expenseList = document.getElementById("expense-list");
    const totalExpensesElement = document.getElementById("total-expenses");

    expenseList.innerHTML = "";
    expenses.forEach((expense, index) => {
        const listItem = document.createElement("div");
        listItem.classList.add("expense-item");
        listItem.innerHTML = `<span>${expense.description} - $${expense.amount.toFixed(2)}</span>
                              <button onclick="deleteExpense(${index})">Delete</button>`;
        expenseList.appendChild(listItem);
    });

    totalExpensesElement.textContent = totalExpenses.toFixed(2);
}
