export interface User {
    id?: number;
    username: string;
    email?: string;
    name?: string;
    surname?: string;
    nr_tel?: string;
    token?: string;
  }
  
  export interface UserWithPassword extends User {
    password: string;
  }