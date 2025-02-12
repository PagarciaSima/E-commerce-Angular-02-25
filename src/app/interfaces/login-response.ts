export interface LoginResponse {
    user: User
    jwtToken: string
  }
  
  export interface User {
    userName: string
    userFirstName: string
    userLastName: string
    userPassword: string
    role: Role[]
  }
  
  export interface Role {
    roleName: string
    roleDescription: string
  }
  