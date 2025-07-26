import axios from "axios";

const getToken = (): string | null => {
  return localStorage.getItem("token");
};

const api = axios.create({
  baseURL: "http://localhost:8080/",
});
const api2 = axios.create({
  baseURL: "http://localhost:8080/",
});
api2.interceptors.request.use(
  (config) => {
    console.log('aaaa2')
    const token = getToken();
    if (token) {
      config.headers['Content-Type'] = 'application/json;charset=utf-8';
      config.headers['Access-Control-Allow-Origin'] = '*';
      config.headers.post['Access-Control-Allow-Origin'] = '*';

      console.log(config.headers);

    } else {
      console.log('semtkn2')
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const apiPublic = api2;

api.interceptors.request.use(
  (config) => {
    console.log('aaaa')
    const token = getToken();
    if (token) {
      config.headers['Content-Type'] = 'application/json;charset=utf-8';
      // config.headers['Access-Control-Allow-Origin'] = '*';
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log(config.headers);

    } else {
      console.log('semtkn')
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



export default api;

;