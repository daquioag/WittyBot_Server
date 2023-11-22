export type User = {
    id: number;
    username: string;
    email: string;
    password: string;
    apicalls: number;
    token?: string;
    admin: boolean;
  };

  export type CreateUserParams = {
    username: string;
    email: string;
    password: string;
    admin?: boolean; // Making admin optional
  };

  export type DeleteUserParams = {
    id:number;
  }

  export type NewPasswordParams = {
    password: string;
  }

  export type PatchUserParams = {
    password?: string;
    username?: string;
    admin?: boolean;
    email?: string;
  }
  
  export type LoginUserParams = {
    email: string;
    password: string;
  };
  
  