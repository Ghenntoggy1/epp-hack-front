
import { axios } from "@/lib";
import { UserWithPassword } from "@/types/user";

export const auth = {
  login: (credentials: { username: string; password: string }) => {
    return axios.post("/auth/authenticate", credentials);
  },
  register: (credentials: UserWithPassword) => {
    return axios.post("/auth/register", credentials);
  },
  confirmEmail: (token: string) => {
    return axios.get(`/confirm?token=${token}`);
  },
};
