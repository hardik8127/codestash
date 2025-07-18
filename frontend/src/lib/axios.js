import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:8080/api/v1" : "https://codestash-backend-d2fc20e3f35a.herokuapp.com/api/v1",
    withCredentials: true,
})