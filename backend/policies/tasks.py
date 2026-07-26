import fitz  # PyMuPDF for OCR and text extraction from scanned PDFs
from decouple import config
from .models import Policy
from rag.vectorstore import get_vectorstore
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, UnstructuredPDFLoader
from celery import shared_task


# load  text from image based pdfs using  OCR
def is_scanned_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    for page in doc:
        if page.get_text().strip():
            doc.close()
            return False  # Has text → not scanned
    doc.close()
    return True  # No text → likely scanned


@shared_task
def process_policy(policy_id):
    """
    PDF → chunks → embeddings → Chroma
    """

    policy = Policy.objects.get(id=policy_id)  # had to handle

    # 1. loading file
    file_path = policy.file.path
    if is_scanned_pdf(file_path):
        print("Processing scanned PDF... using OCR")
        loader = UnstructuredPDFLoader(file_path, poppler_path=config("POPPLER_PATH"), strategy="ocr_only")  # Use OCR-capable loader for scanned PDFs
    else:
        print("Processing regular PDF...")
        loader = PyPDFLoader(file_path)

    docs = loader.load()

    # 2. splitting into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200, add_start_index=True)
    chunks = text_splitter.split_documents(docs)

    if len(chunks) > 300:  # todo : change limit later
        raise ValueError("policy is too large ")  # set a limit to avoid memory issues during embedding generation

    # update metadata for each chunk
    for chunk in chunks:
        chunk.metadata.update(
            {
                "policy_id": policy.id,
                "user_id": policy.uploaded_by.id,
                "source": policy.file.name,
            }
        )

    vector_store = get_vectorstore()

    # filter out empty chunks (these will produce empty embeddings)
    non_empty_chunks = [c for c in chunks if c.page_content and c.page_content.strip()]

    # batch chunks into groups of 100 to avoid memory issues during embedding generation
    batch_size = 100
    for i in range(0, len(non_empty_chunks), batch_size):
        batch = non_empty_chunks[i : i + batch_size]
        vector_store.add_documents(batch)

    # vector_store.add_policys(non_empty_chunks)

    policy.status = "Ready"
    policy.save()
