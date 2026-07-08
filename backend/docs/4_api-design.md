# Api Endpoints 


## Authentication
- POST /api/auth/login/  - login user ( only is_active = true users)
- POST /api/auth/logout/ - logout user 
- GET /api/about/me/  - get current user object





## Admin permissoins routes

### User management

- POST /api/users/   - create user 
- GET /api/users/    - get users list
- PATCH  /api/users/<int:user_id>/   - update user 
- DELETE /api/users/<int:user_id>/   - delete user 



## Policy Management 
------------------------------------------------

- POST /api/policis/  - create policy 
- GET /api/policis/  - list policies
- PATCH /api/policis/  - update policy 
- DELETE /api/policis/  - delete policy 