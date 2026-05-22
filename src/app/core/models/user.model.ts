export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface UserPublic {
  id: string;
  name: string;
  email: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends AuthCredentials {
  name: string;
  confirmPassword: string;
}
