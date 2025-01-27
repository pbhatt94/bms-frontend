import { ResponseType, Role } from './models';

export type User = {
  userId: string;
  name: string;
  email: string;
  username: string;
  age: number;
  phoneNo: string;
  address: string;
  password: string;
  role: Role;
  account: Account;
};

export interface Account {
  id: string;
  accountNumber: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

export interface AccountsResponse {
  status: ResponseType;
  message: string;
  data: Account;
}

export type UsersResponse = {
  status: ResponseType;
  message: string;
  data: User[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
};

export type UserResponse = {
  status: string;
  message: string;
  data: User;
};

export type NewUserDetails = {
  username: string;
  password: string;
  age: number;
  name: string;
  email: string;
  address: string;
  phoneNo: number;
};

export type UpdateUserDetails = {
  username: string;
  password?: string;
  age: number;
  name: string;
  email: string;
  address: string;
  phoneNo: number;
};

export type AddUserResponse = {
  status: ResponseType;
  message: string;
  data: User;
};
