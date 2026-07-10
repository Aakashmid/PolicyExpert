from celery import shared_task



@shared_task
def process_policy(policy_id):

    print(
        f"Processing policy {policy_id}"
    )

    ## TODO : 
    # Extract PDF
    # Chunk text
    # Generate embeddings
    # Store in Chroma

    return "Completed"