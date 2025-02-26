import { Role } from "./role";

export interface User {

    userName: string,
    userFirstName: string,
    userLastName: string,
    userPassword: string,
    role?: Role[]
    
}
