import axios from "axios"

let userAxiosInstance = axios.create({

    baseURL: "http://localhost:4000/api/user",
    withCredentials: true
})

let adminAxiosInstance = axios.create({
    baseURL: "http://localhost:4000/api/admin",
    withCredentials: true
})


export { userAxiosInstance, adminAxiosInstance }