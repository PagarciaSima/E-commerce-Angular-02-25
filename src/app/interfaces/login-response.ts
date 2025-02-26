import { User } from "./user"

export interface LoginResponse {
    user: User
    jwtToken: string
  }
  
  