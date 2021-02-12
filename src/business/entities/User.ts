
export interface AuthenticationData {
  id: string;
  role?: string;
}

export interface UserInputDTO {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UserLoginInputDTO {
  email: string;
  password: string
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
     public readonly role: UserRole = UserRole.NORMAL
  ) { }


  static stringToUserRole(input: string): UserRole {
     switch (input.toUpperCase()) {
        case "NORMAL":
           return UserRole.NORMAL;
        case "ADMIN":
           return UserRole.ADMIN;
        default:
           return UserRole.NORMAL
     }
  }
}