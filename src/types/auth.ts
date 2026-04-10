export interface LoginPayload {
  username: string;
  password: string;
}

export interface User {
  username: string;
  fullname: string;
  role: 'Manajer' | 'Supervisor';
}
