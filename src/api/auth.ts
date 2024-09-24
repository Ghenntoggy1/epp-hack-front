
import { axios } from "@/lib";
import { UserWithPassword } from "@/pages/uni/login/types/user";

export const auth = {
  signin: (credentials: { username: string; password: string }) => {
    return axios.post("/auth/authenticate", credentials);
  },
  signup: (credentials: UserWithPassword) => {
    return axios.post("/auth/register", credentials);
  },
  confirmEmail: (token: string) => {
    return axios.get(`/confirm?token=${token}`);
  },
};
