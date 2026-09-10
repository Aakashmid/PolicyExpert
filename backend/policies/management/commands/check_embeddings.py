import time
from django.core.management.base import BaseCommand, CommandError
from rag.vectorstore import get_vectorstore


class Command(BaseCommand):
    help = "Verify embedding model + vectorstore are working before running Celery ingestion tasks."

    def handle(self, *args, **options):
        self.stdout.write("Checking embedding pipeline...\n")

        # Step 1: init
        try:
            t0 = time.time()
            vs = get_vectorstore()
            self.stdout.write(self.style.SUCCESS(
                f"[OK] Vectorstore initialized ({time.time()-t0:.2f}s)"
            ))
        except Exception as e:
            raise CommandError(f"Vectorstore init failed: {e}")

        # Step 2: embedding call
        test_text = "Employees must submit travel reimbursement within 30 days."
        try:
            t0 = time.time()
            vector = vs._embedding_function.embed_query(test_text)
            self.stdout.write(self.style.SUCCESS(
                f"[OK] Embedding generated ({time.time()-t0:.2f}s), dim={len(vector)}"
            ))
        except Exception as e:
            raise CommandError(f"Embedding call failed: {e}")

        # Step 3: write/read/delete round trip
        test_id = "healthcheck-doc-1"
        try:
            vs.add_texts(
                texts=[test_text],
                metadatas=[{"source": "healthcheck"}],
                ids=[test_id],
            )
            results = vs.similarity_search("travel reimbursement policy", k=1)
            if not results:
                raise CommandError("Similarity search returned no results")
            self.stdout.write(self.style.SUCCESS(
                f"[OK] Retrieval works. Top match: {results[0].page_content[:60]}..."
            ))
        except Exception as e:
            raise CommandError(f"Vectorstore read/write failed: {e}")
        finally:
            vs.delete(ids=[test_id])

        self.stdout.write(self.style.SUCCESS("\nAll checks passed. Safe to run process_policy task."))