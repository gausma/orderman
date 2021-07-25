import { AuthenticationCredentials } from './authentication-credentials';

export interface Authentication {
    id?: string;
    user: string;
    password: string;    
    credentials: AuthenticationCredentials;
}

