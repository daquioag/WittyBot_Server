export type User = {
    id: number;
    username: string;
    email: string;
    password: string;
    apicalls: number;
    token?: string;
    admin: boolean;
    // Add other user properties as needed
  };

  export type CreateUserParams = {
    username: string;
    email: string;
    password: string;
    // apicalls: number;
    // token?: string;
    // admin: boolean;
    // Add other user properties as needed
  };

  export type LoginUserParams = {
    email: string;
    password: string;
    // username: string;
    // apicalls: number;
    // token?: string;
    // admin: boolean;
    // Add other user properties as needed
  };
  
  
  export type SerializedUser = {
    id: number;
    username: string;
    email: string;
    apicalls: number;
    // Omit password and token for serialization
    admin: boolean;
    // Add other user properties as needed
  };
  
