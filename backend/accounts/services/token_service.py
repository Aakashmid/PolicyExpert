from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response

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
                "access_token": str(refresh.access_token),
            },
            status=status_code,
        )
        TokenService.set_cookie_helper(
            response,
            key="refresh_token",
            value=str(refresh),
            max_age=60 * 60 * 24 * 7,  # 7 days
        )
        return response

