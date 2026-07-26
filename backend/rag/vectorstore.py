from decouple import config
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings

_embeddings = None
_vectorstore = None


def get_vectorstore():
    global _embeddings, _vectorstore

    if _vectorstore is None:
        #  create embeddings and for text to vector conversion
        _embeddings = OpenAIEmbeddings(
            api_key=config("GITHUB_TOKEN"),
            base_url=config("GITHUB_BASE_URL"),
            model="openai/text-embedding-3-small",
        )

        # initialize Chroma vector store instance
        _vectorstore = Chroma(
            collection_name="policy_collection",
            embedding_function=_embeddings,
            persist_directory="./local_chromaDb/",  # local directory where data stored
        )

    return _vectorstore
