import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const instance = axios.create({ baseURL: backendUrl });
instance.defaults.headers.common["Content-Type"] = "multipart/form-data";
export default instance;
