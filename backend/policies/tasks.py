from django.conf import settings
import fitz  # PyMuPDF for OCR and text extraction from scanned PDFs
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



PROCESSING_ERRORS = {
    "POLICY_NOT_FOUND": ("The policy could not be found.", False),
    "FILE_NOT_FOUND": ("The uploaded policy file could not be found.", False),
    "PDF_EXTRACTION_FAILED": ("Failed to extract content from the PDF.", False),
    "NO_TEXT_FOUND": ("No readable text was found in this document.", False),
    "POLICY_TOO_LARGE": ("The policy is too large to process.", False),
    "NO_VALID_CHUNKS": ("No valid content could be created from this document.", False),
    "VECTOR_STORE_UNAVAILABLE": ("The AI knowledge base is currently unavailable.", True),
    "INDEXING_FAILED": ("Failed to add the policy to the AI knowledge base.", True),
    "PROCESSING_FAILED": ("An unexpected error occurred while processing the policy.", True),
    "QUEUE_FAILED": ("Could not queue this policy for processing.", True),

}

# helper function to handle policy failed 
def mark_policy_failed(policy, error_code):
    policy.status = Policy.Status.FAILED
    policy.processing_error_code = error_code
    policy.save(update_fields=["status", "processing_error_code"])



@shared_task
def process_policy(policy_id):
    policy = None
    try:
        # 1. Get policy
        try:
            policy = Policy.objects.get(id=policy_id)
        except Policy.DoesNotExist:
            raise ValueError("POLICY_NOT_FOUND")

        # 2. Start processing
        policy.status = Policy.Status.PROCESSING
        policy.processing_error_code= None
        policy.save()

        # 3. Validate file
        if not policy.file:
            raise ValueError("FILE_NOT_FOUND")

        file_path = policy.file.path  # for dev , for procuction implement createing path for file!
        # 4. Load document
        try:
            if is_scanned_pdf(file_path):
                loader = UnstructuredPDFLoader(
                    file_path,
                    poppler_path=settings.POPPLER_PATH,
                    strategy="ocr_only",
                )
            else:
                loader = PyPDFLoader(file_path)

            docs = loader.load()

        except Exception as exc:
            raise ValueError("PDF_EXTRACTION_FAILED") from exc

        # 5. Validate extracted content
        if not docs:
            raise ValueError("NO_TEXT_FOUND")


        # 6. Chunking
        try:
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                add_start_index=True,
            )

            chunks = text_splitter.split_documents(docs)

        except Exception as exc:
            raise ValueError("PDF_EXTRACTION_FAILED") from exc

        # 7. Size validation
        if len(chunks) > settings.POLICY_CHUNKS_LIMIT:  # change later 
            raise ValueError("POLICY_TOO_LARGE")

        # 8. Filter empty chunks
        non_empty_chunks = [
            chunk
            for chunk in chunks
            if chunk.page_content and chunk.page_content.strip()
        ]

        if not non_empty_chunks:
            raise ValueError("NO_VALID_CHUNKS")

        # ------------ not complete , complete later during source citations
        # 9. Add metadata  
        for chunk in non_empty_chunks:
            chunk.metadata.update({
                "policy_id": policy.id,
                # "user_id": policy.uploaded_by.id,# uploaded_by.id can be null
                "source": policy.file.name,
            })
        # ------------

        # 10. Get vector store
        try:
            vector_store = get_vectorstore()
        except Exception as exc:
            raise ValueError("VECTOR_STORE_UNAVAILABLE") from exc

        # 11. Index document
        try:
            batch_size = 100

            for i in range(0, len(non_empty_chunks), batch_size):
                batch = non_empty_chunks[i:i + batch_size]
                vector_store.add_documents(batch)  # doing embeddings 

        except Exception as exc:
            raise ValueError("INDEXING_FAILED") from exc

        # 12. Success
        policy.status = Policy.Status.READY
        policy.processing_error_code= None
        policy.save()

    except ValueError as exc:

        error_code = str(exc)

        if policy:
            mark_policy_failed(policy, error_code)

        raise

    except Exception:

        if policy:
            mark_policy_failed(policy, "PROCESSING_FAILED")

        raise