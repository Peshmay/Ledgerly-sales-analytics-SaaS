export type UserRole = "ADMIN" | "STAFF";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: AuthUser;
  };
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};
