export type Role = "admin" | "employee";


export interface LoginPayload{
    email:string;
    password:string;
}


export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: Role;
  is_active: boolean;
}


export interface LoginResponse {
  detail: string,
  access_token: string,
  must_change_password?: boolean
}