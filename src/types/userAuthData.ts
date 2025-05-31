export interface user_authData {
  id: number;
  email: string;
  login: string;
  first_name: string;
  last_name: string;
  images: string;
  staff: boolean;
}

export const staffUsers: string[] = [
  "youbihi",
  "mmaghri",
  "ymbsout",
  "abablil",
];

export interface Token_type {
  access_token: string;
  refresh_token: string;
}

export interface code_extract {
  code: string;
}

export interface idlogin {
  id: number;
}
