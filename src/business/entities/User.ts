import { CustomError } from "../error/CustomError";

export interface AuthenticationData {
  id: string;
  role?: string;
}

export interface UserInputDTO {
  email: string;
  password: string;
  name: string;
  role: string;
}

export enum UserRole {
  NORMAL = "NORMAL",
  ADMIN = "ADMIN"
}

export class User {
  constructor(
     public readonly id: string,
     public readonly name: string,
     public readonly email: string,
     public readonly password: string,
     public readonly role: UserRole
  ) { }


  static stringToUserRole(input: string): UserRole {
     switch (input) {
        case "NORMAL":
           return UserRole.NORMAL;
        case "ADMIN":
           return UserRole.ADMIN;
        default:
           throw new CustomError(422,"Invalid user role");
     }
  }
}