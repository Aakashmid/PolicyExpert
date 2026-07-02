
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = User.objects.filter(email=email).first()
       
        if user and user.check_password(password):
            attrs['user'] = user
            return attrs
        raise serializers.ValidationError("Invalid credentials")
    


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','first_name','last_name','email','role')



class LoginResponseSerializer(serializers.Serializer):
    access=serializers.CharField()
    detail=serializers.CharField()
    user = UserSerializer()
    