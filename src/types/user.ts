export interface User {
    id?: number;
    username: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    nr_tel?: string;
    token?: string;
    enabled?: boolean;
    mfaEnabled?: boolean;
  }
  
  export interface UserWithPassword extends User {
    password: string;
  }
