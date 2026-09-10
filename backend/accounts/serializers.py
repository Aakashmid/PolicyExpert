from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth import password_validation
from django.core.exceptions import ValidationError
import re


User = get_user_model()


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = (attrs.get("email") or "").strip()
        password = attrs.get("password")

        # find user and validate password in one go to avoid leaking existence
        user = User.objects.filter(email=email).first()

        if not user or not user.check_password(password):
            raise serializers.ValidationError("Invalid credentials")

        if not user.is_active:
            raise serializers.ValidationError(
                "Your account is deactivated. Please contact the administrator"
            )

        attrs["user"] = user
        return attrs



# for token response serializer like refresh and login view 
class TokenResponseSerializer(serializers.Serializer):
    detail = serializers.CharField()
    access_token = serializers.CharField()


### User serializer for user list , create , update 

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "first_name",
            "last_name",
            "email",
            "password",
            "role",
            "is_active",
            "date_joined",
            "updated_at",
        )
        extra_kwargs = {
            "password": {"write_only": True},
            "role": {"read_only": True},
            "is_active": {"default": True},
            "first_name": {"required": True},
            "last_name": {"required": True},
        }


# move somewhere else - like services or utils
def validate_password_strength(value):
    errors = []

    if len(value) < 8:
        errors.append("at least 8 characters")
    if not re.search(r"[A-Z]", value):
        errors.append("an uppercase letter")
    if not re.search(r"[a-z]", value):
        errors.append("a lowercase letter")
    if not re.search(r"\d", value):
        errors.append("a number")
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
        errors.append("a special character")

    if errors:
        raise serializers.ValidationError(f"Password must contain {', '.join(errors)}.")

    return value


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    new_password2 = serializers.CharField(required=True, write_only=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Your old passowrd is incorrect!")
        return value

    def validate(self, data):
        if data['new_password'] != data['new_password2']:
            raise serializers.ValidationError({"new_password2": "The two password fields didn't match."})

        validate_password_strength(data['new_password'])
        return data

    def save(self, **kwargs):
        password = self.validated_data['new_password']
        user = self.context['request'].user
        user.set_password(password)  
        user.must_change_password=False
        user.save()
        return user   