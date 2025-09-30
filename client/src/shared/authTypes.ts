export type Mode = "signin" | "signup";

export type FormValues = {
  username?: string; // используется в signup и, опционально, в signin
  email: string; // в signin играет роль username (name)
  password: string;
};

// API контракт
export type ApiUser = {
  id: string;
  name: string;
  email?: string;
  createdAt?: string;
};
export type ApiOk = { ok: true; user: ApiUser };
export type ApiErrCode =
  | "name_taken"
  | "email_taken"
  | "password_too_short"
  | "invalid_credentials"
  | "validation_error"
  | "name_and_password_required"
  | "invalid_email"
  | "server_error";
export type ApiErrorField =
  | ApiErrCode
  | { code?: ApiErrCode; message?: string }
  | string
  | undefined;
export type ApiError = { ok: false; error?: ApiErrorField };
export type SignupResponse = ApiOk | ApiError;
export type LoginResponse = ApiOk | ApiError;
