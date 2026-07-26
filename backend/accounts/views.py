from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny , IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from drf_spectacular.utils import extend_schema
from .serializers import LoginSerializer, UserSerializer, LoginResponseSerializer
from core.permissions import IsEmployee, IsAdmin 
from typing import Any
User = get_user_model()
# Create your views here.


# not using yet !
class TokenService:
    @staticmethod
    def set_cookie_helper(response, key, value, max_age=None):
        response.set_cookie(
            key=key,
            value=value,
            httponly=True,
            secure=True,
            samesite="None",
            path="/",
            max_age=max_age,
        )

    @staticmethod
    def create_token_response(user, message, status_code):
        refresh = RefreshToken.for_user(user)
        response = Response(
            {
                "detail": message,
                "access": str(refresh.access_token),
            },
            status=status_code,
        )
        TokenService.set_cookie_helper(
            response,
            key="refresh_token",
            value=str(refresh),
            max_age=60 * 60 * 24 * 7,  # 7 days
        )
        return refresh.access_token


class LoginView(APIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    @extend_schema(responses=LoginResponseSerializer)
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]   # type: ignore
            access_token = RefreshToken.for_user(user).access_token
            refresh_token = RefreshToken.for_user(user)
            user_data = UserSerializer(user).data  # user data

            response_data = {
                "detail": "Login successful",
                "access": access_token,
                "refresh": refresh_token,
                "user": user_data,
            }

            response_serializer = LoginResponseSerializer(response_data)
            return Response(response_serializer.data, status=status.HTTP_200_OK)

        error_message = next(iter(serializer.errors.values()))[0]
        return Response({"error": error_message}, status=status.HTTP_400_BAD_REQUEST)



# had to test 
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            # Get the refresh token from the request body
            refresh_token = request.data.get('refresh_token')
            
            if not refresh_token:
                return Response(
                    {'detail': 'Refresh token is required.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create a RefreshToken instance
            token = RefreshToken(refresh_token)
            
            # Blacklist the token
            token.blacklist()
            
            return Response(
                {'detail': 'Successfully logged out.'}, 
                status=status.HTTP_205_RESET_CONTENT
            )
            
        except TokenError as e:
            return Response(
                {'detail': 'Invalid token or already logged out.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    

class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]


# havt to test 
class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
    


class AboutMeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self) :  
        return self.request.user

