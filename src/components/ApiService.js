import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});


api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken.accessToken || accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await api.post("/api/auth/refresh", {}, { withCredentials: true });
        if (refreshResponse.data?.data) {
          setAccessToken(refreshResponse.data.data);
          originalRequest.headers["Authorization"] = `Bearer ${refreshResponse.data.data}`;
          return api(originalRequest);
        }
      } catch {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);


const ApiService = {
  // ----------- SECURITY -----------
  setAccessToken,

  login: (username, password) => api.post("/api/auth/login", { username, password }),

  logout: () => api.post("/api/auth/logout", {}, { withCredentials: true }),

  refreshToken: () => api.post("/api/auth/refresh", {}, { withCredentials: true }),


  register: (newItem) => {
    const payload = {
      username: newItem.username,
      password: newItem.password,
      email: newItem.email,
      roles: [{ name: newItem.roles || "ROLE_USER" }],
    };
    return api.post("/api/auth/register", payload);
  },

  // ----------- PRICE -----------
  findByCategory: (category) =>
    api.get("/api/price/find/byCategory", { params: { category } }),

  // ----------- PRODUCT -----------
  addProduct: (product) => api.post("/api/product/add", product),

  addProductPrice: (productWithPrice) =>
    api.post("/api/product/add/product/price", productWithPrice),

  deleteProduct: (productId) => api.delete(`/api/product/delete/${productId}`),

  // ----------- NOTES -----------
  findNotesByTitleAndDates: (title, dateFrom, dateTo) =>
    api.get("/api/note/find/byFilters", {
      params: {
        title: title?.trim() || null,
        dateFrom: dateFrom ? formatDateToISO(dateFrom) : null,
        dateTo: dateTo ? formatDateToISO(dateTo) : null,
      },
    }),

  findAllNotes: () => api.get("/api/note/find/all"),
  addNotes: (notesList) => api.post("/api/note/add", notesList),

  findNotificationsByDates: (createdAt) =>
    api.get("/api/note/find/byDates", { params: { createdAt } }),
  deleteNoteById: (noteId) => api.delete(`/api/note/delete/${noteId}`),

  // ----------- ORDERS -----------
  findAllOrders: () => api.get("/api/orders/find/all"),
  addOrders: (orderList) => api.post("/api/orders/add", orderList),
  findGroupedOrders: () => api.get(`/api/orders/by-date`),
  deleteOrder: (orderId) => api.delete(`/api/orders/delete/${orderId}`),

  // ----------- SCHEDULES -----------
  findAllSchedules: () => api.get("/api/schedule/find/all"),
  addSchedules: (scheduleList) => api.post("/api/schedule/add", scheduleList),
  deleteSchedule: (scheduleId) => api.delete(`/api/schedule/delete/${scheduleId}`),
};


function formatDateToISO(date) {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

export default ApiService;
export { api };