
import { axios } from "@/lib";
import { UserWithPassword } from "@/types/user";

export const auth = {
  login: (credentials: { username: string; password: string }) => {
    return axios.post("/auth/login", credentials);
  },
  register: (credentials: UserWithPassword) => {
    return axios.post("/auth/register", credentials);
  },
  validate: (credentials: { username: string; code: number }) => {
    return axios.post("/auth/validate-mfa", credentials);
  },
  confirmEmail: (token: string) => {
    return axios.get(`/confirm?token=${token}`);
  },
  hasMFA: (credentials: { username: string, token: string }) => {
    return axios.post("/auth/has-mfa", credentials);
  }
};
