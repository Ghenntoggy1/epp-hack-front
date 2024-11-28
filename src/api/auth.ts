
import { axios } from "@/lib";
import { UserWithPassword } from "@/types/user";

export const auth = {
  login: (credentials: { username: string; password: string }, withCredentials = false ) => {
    return axios.post("/auth/login", credentials);
  },
  logout: (withCredentials = false ) => {
    return axios.post("/auth/logout");
  },
  register: (credentials: UserWithPassword, withCredentials = false ) => {
    return axios.post("/auth/register", credentials);
  },
  validate: (credentials: { username: string; code: number }, withCredentials = false ) => {
    return axios.post("/auth/validate-mfa", credentials);
  },
  confirmEmail: (token: string, withCredentials = false ) => {
    return axios.get(`/confirm?token=${token}`);
  },
  hasMFA: (credentials: { username: string, token: string }, withCredentials = false ) => {
    return axios.post("/auth/has-mfa", credentials);
  },
//   checkToken: () => {
//     return axios.get("/auth/decode_token", {
//         withCredentials: true,
//     })
//     .then(response => {
//         console.log("Response:", response);
//         // Return the actual data (assuming the token is in response.data)
//         return response.data; // Adjust this based on where your token is located in the response
//     })
//     .catch(error => {
//         console.log("Error:", error.response || error);
//         // You may want to return null or throw the error so you can handle it later
//         return null; // or throw error;
//     });
// }
};
