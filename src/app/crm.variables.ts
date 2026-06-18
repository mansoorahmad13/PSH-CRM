export const apiPath = "https://adminbackend.pakistansweethome.org.pk/api/"

export type Role = 'super_admin' | 'admin' | 'agent' | 'relationship_manager' | 'user_admin' | 'accountant' | 'senior_rm' | 'writer' | 'handle_volunteer'

export interface User {
    id: number;
    email: string;
    role: Role;
    display_name: string | null;
    token: string;
}