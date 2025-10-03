from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader

class DocumentParser:
    def __init__(self, path: str):
        self.path = path

    def parse(self):
        loader = PyPDFLoader(self.path)
        docs = loader.load()

        splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
        return splitter.split_documents(docs)
