import { Role } from "../app.variables";

export interface LoginResponse {
  admin: {
    id: number;
    email: string;
    roles: {
        role: Role;
        display_name: string | null;
    }[]
  };
  token: string
}