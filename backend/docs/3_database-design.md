# Database Design

## User

Purpose:
Stores application users.

Fields

- id (PK)
- first_name
- last_name
- email (Unique)
- password
- role (ADMIN | EMPLOYEE)
- is_active
- created_at
- updated_at

Relationship

User
 └── has many Conversations

----------------------------------