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

    if (!originalRequest._retry && error.response) {
      const status = error.response.status;

      if (status === 401) {
        originalRequest._retry = true;
        try {
          const refreshResponse = await api.post("/api/auth/refresh", {}, { withCredentials: true });
          if (refreshResponse.data?.data) {
            const newToken = refreshResponse.data.data.accessToken || refreshResponse.data.data;
            setAccessToken(newToken);
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return api(originalRequest); 
          } else {
            window.location.href = "/";
          }
        } catch (err) {
          console.warn("Refresh token failed:", err);
          window.location.href = "/";
        }
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

  // ----------- USER -----------
  getAllUsers: () => api.get("/api/users"),

  getUserById: (userId) => api.get(`/api/users/${userId}`),

  getUserAvatar: async (userId) => {
    try {
      const response = await api.get(`/api/users/${userId}/avatar`, {
        responseType: "blob",
        validateStatus: (status) => status < 500, 
      });

      if (response.status === 404 || !response.data) {
        return null;
      }

      const blobUrl = URL.createObjectURL(response.data);
      return blobUrl;

    } catch (error) {
      console.error(`❌ Error loading avatar for userId ${userId}:`, error);
      return null; 
    }
  },

  updateAvatar: (userId, avatarUrl) => 
    api.put(`/api/users/${userId}/avatar`, avatarUrl, {
      headers: { "Content-Type": "application/json" },
    }),

  // ----------- PRICE -----------
  findByCategory: (category) =>
    api.get("/api/price/find/byCategory", { params: { category } }),
  saveProductWithBarcode: (dto, barcode) => api.post("/api/product/add/barcode", { dto, barcode }),

  // ----------- CUSTOMER-ORDERS -----------
  addProductByBarcode: (data) => api.post("/api/customer-orders/scanBarcode", data),
  createOrderForCustomer: () => api.post("/api/customer-orders/create/order"),
 
  // ----------- PRODUCT -----------
  addProduct: (product) => api.post("/api/product/add", product),

  addProductPrice: (productWithPrice) => api.post("/api/product/add/product/price", productWithPrice),
  updateProductWithPrice: (productWithPriceDTO) => api.put(`/api/product/update/product/price`, productWithPriceDTO),
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
  findNotificationsByDates: (createdAt) => api.get("/api/note/find/byDates", { params: { createdAt } }),
  updateNote: (note) => api.put(`/api/note/update/${note.id}`, note),
  deleteNoteById: (noteId) => api.delete(`/api/note/delete/${noteId}`),

  // ----------- ORDERS -----------
  findAllOrders: () => api.get("/api/orders/find/all"),
  addOrders: (orderList) => api.post("/api/orders/add", orderList),
  findGroupedOrders: () => api.get(`/api/orders/by-date`),
  updateOrder: (order) => api.put(`/api/orders/update/${order.id}`, order),
  deleteOrder: (orderId) => api.delete(`/api/orders/delete/${orderId}`),

  // ----------- SCHEDULES -----------
  findAllSchedules: () => api.get("/api/schedule/find/all"),
  addSchedules: (scheduleList) => api.post("/api/schedule/add", scheduleList),
  updateSchedule: (schedule) => api.put(`/api/schedule/update/${schedule.id}`, schedule),
  deleteSchedule: (scheduleId) => api.delete(`/api/schedule/delete/${scheduleId}`),

  // ----------- CHAT -----------
  createRoom: (room) => api.post("/api/chat/room", room),
  getUserRooms: (userId) => api.get(`/api/chat/rooms/${userId}`),
  getMessages: (roomId) => api.get(`/api/chat/room/${roomId}/messages`),
  sendMessage: (roomId, message) => api.post(`/api/chat/room/${roomId}/message`, message),
  addMembers: (roomId, memberIds) => api.post(`/api/chat/room/${roomId}/members`, memberIds),

};


function formatDateToISO(date) {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

export default ApiService;
export { api };