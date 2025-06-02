export interface userDatabaseSchema {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  login: string;
  images?: string;
  club_staff: boolean;
  staff: boolean;
  role: boolean;
  created_at: Date;
}

export interface user_authData {
  id: number;
  email: string;
  login: string;
  first_name: string;
  last_name: string;
  images: string;
  staff: boolean;
  access_token : string
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
  expo_notification_token: string;
  code: string;
}

export interface idlogin {
  id: number;
}
