from django.db import models

# Create your models here.


class Conversation(models.Model):
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        "accounts.User", on_delete=models.CASCADE, related_name="conversations"
    )
    
    def __str__(self) -> str:
        return self.title or f"Conversation {self.id}" 
     

class Message(models.Model):
    conversation = models.ForeignKey(
        "chat.Conversation", on_delete=models.CASCADE, related_name="messages"
    )

    question = models.CharField(max_length=500)
    answer = models.TextField()
    response_time = models.PositiveIntegerField()
    sources = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self) -> str:  # readable representation
        return f"Message {self.id} in Conversation {self.conversation_id}"


class Feedback(models.Model):
    RATING_CHOICES = [
        ("positive", "Positive"),
        ("negative", "Negative"),
    ]

    message = models.OneToOneField(
        "chat.Message", on_delete=models.CASCADE, related_name="feedback"
    )
    rating = models.CharField(max_length=10, choices = RATING_CHOICES)
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Feedback {self.rating} for Message {self.message_id}"

