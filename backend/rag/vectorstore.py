from django.conf import settings
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings

_embeddings = None
_vectorstore = None


# to-do : modify to handle and logging error
def get_vectorstore():
    global _embeddings, _vectorstore

    if _vectorstore is None:
        #  embedding model config  for text to vector conversion
        _embeddings = GoogleGenerativeAIEmbeddings(
            model="gemini-embedding-001",
            google_api_key=settings.GOOGLE_API_KEY,
            task_type="retrieval_document",  # important for RAG — use "retrieval_query" at query time
            output_dimensionality=768,
        )

        # initialize Chroma vector store instance
        _vectorstore = Chroma(
            collection_name="policy_collection",
            embedding_function=_embeddings,
            persist_directory="./local_chromaDb/",  # local directory where data stored
        )

    return _vectorstore


# # to-do : modify to handle and logging error
# def get_vectorstore():
#     global _embeddings, _vectorstore

#     if _vectorstore is None:
#         #  create embeddings and for text to vector conversion
#         _embeddings = OpenAIEmbeddings(
#             api_key=settings.GITHUB_TOKEN,
#             base_url=settings.GITHUB_BASE_URL,
#             model="openai/text-embedding-3-small",
#         )

#         # initialize Chroma vector store instance
#         _vectorstore = Chroma(
#             collection_name="policy_collection",
#             embedding_function=_embeddings,
#             persist_directory="./local_chromaDb/",  # local directory where data stored
#         )

#     return _vectorstore
