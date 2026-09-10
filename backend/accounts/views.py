from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework import status, generics, serializers
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import NotAuthenticated, AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from drf_spectacular.utils import extend_schema, OpenApiResponse, inline_serializer
from .services import PasswordService, TokenService

from drf_spectacular.types import OpenApiTypes
from .serializers import LoginSerializer, UserSerializer, ChangePasswordSerializer
from core.permissions import IsEmployee, IsAdmin
from typing import Any

User = get_user_model()
# Create your views here.


class LoginView(APIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    @extend_schema(
        responses={
            200: inline_serializer(
                name="LoginResponse",
                fields={
                    "detail": serializers.CharField(),
                    "access_token": serializers.CharField(),
                    "must_change_password": serializers.BooleanField(),
                },
            ),
        },
    )
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]  # type: ignore
        return TokenService.create_token_response(user, 'Login successful', status.HTTP_200_OK)


class CustomTokenRefreshView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        responses={
            200: inline_serializer(
                name="TokenRefreshResponse",
                fields={
                    "detail": serializers.CharField(),
                    "access_token": serializers.CharField(),
                },
            ),
        }
    )
    def post(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            if not refresh_token:
                raise NotAuthenticated("Refresh token not found")

            # This will raise TokenError if blacklisted
            refresh = RefreshToken(refresh_token)

            # Generate new access token
            new_access_token = str(refresh.access_token)

            return Response(
                {
                    'detail': 'Token refreshed successfully',
                    'access_token': new_access_token,
                },
                status=status.HTTP_200_OK,
            )

        except TokenError as e:
            # Handle blacklisted or invalid tokens
            raise AuthenticationFailed("Token is blacklisted or invalid")
        except InvalidToken as e:
            raise AuthenticationFailed("Invalid token format")


# had to test


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            if not refresh_token:
                raise NotAuthenticated("Refresh token not found")

            token = RefreshToken(refresh_token)
            token.blacklist()

            response = Response({'detail': 'Logout successful'}, status=status.HTTP_200_OK)
            response.delete_cookie('refresh_token')
            return response
        except Exception:
            raise AuthenticationFailed("Invalid token ")


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

 
    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': 'Password updated successfully.'}, status=status.HTTP_200_OK)


class UserMeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    def perform_create(self, serializer):
        user = serializer.save()
        user.must_change_password = True  # return  must_change_password in login response and force user to change password on first login
        user.save()


class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
    lookup_field = "id"   # actual DB field
    lookup_url_kwarg = "user_id"  # URL parameter name

    def delete(self,request, *args, **kwargs):
        user = self.get_object()
        if user.is_superuser:
            return Response({"detail": "Cannot delete superuser"}, status=status.HTTP_403_FORBIDDEN)
        return super().delete(request, *args, **kwargs)


class UserActivateView(APIView):
    permission_classes = [IsAdmin]

    def post(self,request, user_id):
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        user.is_active = True
        user.save()
        return Response({"detail": "user activated"}, status=status.HTTP_200_OK)


class UserDeactivateView(APIView):
    permission_classes = [IsAdmin]

    def post(self,request, user_id):
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        user.is_active = False
        user.save()
        return Response({"detail": "user deactivated"}, status=status.HTTP_200_OK)

#  not finished yet ! 
class UserPasswordResetView(APIView):
    permission_classes = [IsAdmin]

    def post(self,request, user_id):
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # had to change
        # get new temporay password generated by admin and
        # send it to user via email and user can change it later on himself  ( check for sending email to read free alternative)

        temp_password = PasswordService.generate_temp_password()
        try:
            PasswordService.send_temp_password_email(user, temp_password)
        except Exception:
            return Response({"detail": "Failed to send email, password not changed"}, status=status.HTTP_502_BAD_GATEWAY)

        user.set_password(temp_password)
        user.must_change_password = True
        user.save()
        return Response({"detail": "password reset and sent via email"}, status=status.HTTP_200_OK)


# have to add update user api - for both admin and employee .
# employee can update only his own data and admin can update any user data but only non-admin users and only inactive field not all.
