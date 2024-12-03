import os
import PyPDF2
from docx import Document
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.vectorstores import Chroma
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_community.llms import Ollama
from langchain_community.embeddings.ollama import OllamaEmbeddings  # If using Ollama for embeddings

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# Set up the Embedding model (using Ollama here, but could switch to OpenAI if needed)
embedding_model = OllamaEmbeddings()  # Replace with your choice of embedding model

# Chroma connection details
CHROMA_SERVER_URL = "http://chroma:8000"  # Docker Compose internal network address
CHROMA_DB_PATH = "/chroma_db"   # If using remote Chroma server

# Function to extract text from PDF files
def extract_text_from_pdf(pdf_path):
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text

# Function to extract text from DOCX files
def extract_text_from_docx(docx_path):
    doc = Document(docx_path)
    text = ""
    for para in doc.paragraphs:
        text += para.text
    return text

# Function to load documents from a directory and preprocess them
def load_documents_from_directory(directory_path):
    documents = []
    for filename in os.listdir(directory_path):
        file_path = os.path.join(directory_path, filename)
        if filename.endswith(".txt"):
            with open(file_path, 'r', encoding='utf-8') as file:
                text = file.read()
            documents.append({"content": text, "source": filename})
        elif filename.endswith(".pdf"):
            text = extract_text_from_pdf(file_path)
            documents.append({"content": text, "source": filename})
        elif filename.endswith(".docx"):
            text = extract_text_from_docx(file_path)
            documents.append({"content": text, "source": filename})
    return documents

# Load documents into Chroma and create an index
def create_chroma_index():
    documents = load_documents_from_directory("/path/to/your/documents")
    # Create the vectorstore with the extracted documents and embeddings
    vectorstore = Chroma.from_documents(documents, embedding_function=embedding_model.embed_query, collection_name="your_collection")
    vectorstore.persist(directory=CHROMA_DB_PATH)  # Persist the index for later use
    return vectorstore

# Load the Chroma vector store from disk or from a remote server
vectorstore = create_chroma_index()

# Define the prompt template
PROMPT_TEMPLATE = """
Basing only on the following context:

{context}

---

Answer the following question: {question}
Avoid to start the answer saying that you are basing on the provided context and go straight with the response.
"""

# Set up the prompt template for LLMChain
prompt_template = PromptTemplate(input_variables=["context", "question"], template=PROMPT_TEMPLATE)

# Initialize the LLM model (Ollama in this case)
from langchain_community.llms import Ollama
llm = Ollama(model="llama2")

# Flask route to answer a question
@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.get_json()
    question = data.get('question')

    if not question:
        return jsonify({"error": "Question is required"}), 400

    # Retrieve the most similar documents from Chroma
    docs = vectorstore.similarity_search(question, k=3)  # Adjust 'k' based on how many results you want
    context = " ".join([doc.page_content for doc in docs])

    # Generate the response using the context and the question
    chain = LLMChain(llm=llm, prompt=prompt_template)
    response = chain.run({"context": context, "question": question})

    # Return the response along with the document sources
    doc_sources = [{"content": doc.page_content, "source": doc.metadata.get("source", "Unknown")} for doc in docs]
    return jsonify({"answer": response, "documents": doc_sources})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
