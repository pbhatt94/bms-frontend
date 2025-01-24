import { Role } from './models';

export type httpError = {
  error: {
    code: number;
    message: string;
  };
};

export type LoginResponse = {
  status: string;
  message: string;
  data: {
    'JWT Token': string;
  };
};

export type LoginRequest = {
  username: string;
  password: string;
};
