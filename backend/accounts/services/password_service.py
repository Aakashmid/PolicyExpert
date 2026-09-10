import secrets
import string
from django.core.mail import send_mail
from django.conf import settings

# had to update completely 
class PasswordService:
    @staticmethod
    def generate_temp_password(length=12):
        """Generate a cryptographically secure random password."""
        alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
        # Ensure at least one of each character type for password strength rules
        password = [
            secrets.choice(string.ascii_uppercase),
            secrets.choice(string.ascii_lowercase),
            secrets.choice(string.digits),
            secrets.choice("!@#$%^&*"),
        ]
        password += [secrets.choice(alphabet) for _ in range(length - 4)]
        secrets.SystemRandom().shuffle(password)
        return "".join(password)

    @staticmethod
    def send_temp_password_email(user, temp_password):
        send_mail(
            subject="Your temporary password",
            message=(
                f"Hi {user.get_full_name() or user.username},\n\n"
                f"An admin has reset your password. Your temporary password is:\n\n"
                f"{temp_password}\n\n"
                f"Please log in and change it immediately."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )