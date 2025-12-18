import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, 
});


api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    let message = "Something went wrong";
    
    if (error.response) {
      const { data, status } = error.response;
      message = data?.message || data?.error || `Server error (${status})`;
      
      if (status === 401) {
        console.error("Unauthorized access");
      } else if (status === 404) {
        message = "Resource not found";
      } else if (status === 500) {
        message = "Internal server error";
      }
    } else if (error.request) {
      message = "Network error. Please check your connection.";
    } else {
      message = error.message;
    }
    
    return Promise.reject(new Error(message));
  }
);

export const getTodos = async () => {
  const response = await api.get("/todos");
  return response.data;
};

export const createTodo = async (data: any) => {
  return api.post("/todos", data);
};

export const updateStatus = async (id: string, status: string) => {
  return api.patch(`/todos/${id}`, { status });
};

export const deleteTodo = async (id: string) => {
  return api.delete(`/todos/${id}`);
};