export interface LoginPayload {
  username: string;
  password: string;
}

export interface User {
  username: string;
  first_name?: string;
  last_name?: string;
  fullname: string;
  role: 'Manajer' | 'Supervisor' | 'Operator';
}
