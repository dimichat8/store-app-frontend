import axios from "axios";

const API_BASE_URL = "http://localhost:8080"; 

class ApiService {

//------------PRICE------------//

// GET find by category
    static async findByCategory(category) {
        return axios.get(`${API_BASE_URL}/api/price/find/byCategory`, {
        params: { category }
        });
    }

//------------PRODUCT------------//

//POST add product
    static async addProduct(product) {
        return axios.post(`${API_BASE_URL}/api/product/add`, product, {
            headers: { "Content-Type": "application/json" }
        });
    }

    //POST add product
    static async addProductPrice(productWithPrice) {
        return axios.post(`${API_BASE_URL}/api/product/add/product/price`, productWithPrice, {
            headers: { "Content-Type": "application/json" }
        });
    }


//DELETE delete product
    static async deleteProduct(productId) {
        return axios.delete(`${API_BASE_URL}/api/product/delete/${productId}`, {
        headers: { "Content-Type": "application/json" }
        });
    }

//------------NOTES------------//

//GET find notes by title and dates
    static async findNotesByTitleAndDates(title, dateFrom, dateTo) {
        return axios.get(`${API_BASE_URL}/api/note/find/byFilters`, {
            params: {
                title: title?.trim() || null,
                dateFrom: dateFrom ? formatDateToISO(dateFrom) : null,
                dateTo: dateTo ? formatDateToISO(dateTo) : null
        },
            headers: { "Content-Type": "application/json" }
            });
        }  
        
//GET find all notes 
    static async findAllNotes() {
        return axios.get(`${API_BASE_URL}/api/note/find/all`, {
            headers: { "Content-Type": "application/json" }
            });
    }         

//POST add notes
    static async addNotes(notesList) {
        return axios.post(`${API_BASE_URL}/api/note/add`, notesList, {
        headers: { "Content-Type": "application/json" },
        });
    }

//GET find all notifications 
    static async findNotificationsByDates(createdAt) {
        return axios.get(`${API_BASE_URL}/api/note/find/byDates`,{
            params: { createdAt },
            headers: { "Content-Type": "application/json" }
            });
    }     

//------------ORDERS------------//

//GET find all orders 
    static async findAllOrders() {
        return axios.get(`${API_BASE_URL}/api/orders/find/all`, {
            headers: { "Content-Type": "application/json" }
            });
        }   

//POST add orders
    static async addOrders(orderList) {
        return axios.post(`${API_BASE_URL}/api/orders/add`, orderList, {
            headers: { "Content-Type": "application/json" },
            });
        }

//DELETE delete order
    static async deleteOrder(orderId) {
        return axios.delete(`${API_BASE_URL}/api/orders/delete/${orderId}`, {
        headers: { "Content-Type": "application/json" }
        });
    }
    
//------------Schedules------------//

//GET find all schedules 
    static async findAllSchedules() {
        return axios.get(`${API_BASE_URL}/api/schedule/find/all`, {
            headers: { "Content-Type": "application/json" }
            });
        }

//POST add orders
    static async addSchedules(scheduleList) {
        return axios.post(`${API_BASE_URL}/api/schedule/add`, scheduleList, {
            headers: { "Content-Type": "application/json" },
            });
        }

//DELETE delete order
    static async deleteSchedule(scheduleId) {
        return axios.delete(`${API_BASE_URL}/api/schedule/delete/${scheduleId}`, {
        headers: { "Content-Type": "application/json" }
        });
    }        
}

    function formatDateToISO(date) {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    }



export default ApiService;