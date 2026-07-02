# Authentication

POST /api/auth/login/

Description

Login user

Permission

Public

Request

{
    "email":"",
    "password":""
}

Response

{
    "access":"",
    "refresh":"",
    "user":{
        "id":1,
        "role":"ADMIN"
    }
}

------------------------------------------------

GET /api/auth/me/

Description : will return 

Current user

Permission

Authenticated

------------------------------------------------

POST /api/auth/logout/
