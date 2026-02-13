export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponseData {
    token: string;
    user: {
      email: string;
    };
  }
  
  export interface MeResponse {
    authenticated: boolean;
  }