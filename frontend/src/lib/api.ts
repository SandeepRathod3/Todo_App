import axios from "axios";

const API_URL='http://localhost:3000/todos'

export const getTodos= async()=>{
    
   try {
     const res= await axios.get(API_URL);
     return res.data
   } catch (error:any) {
            throw new Error(error.response?.data?.message || "Something went wrong");

   }
}

export const createTodo= async(data:any)=>{
    try {
        const res= await axios.post(API_URL,data);
        return res.data
    } catch (error:any) {
        throw new Error(error.response?.data?.message || "Something went wrong");
    }
}

export const updateStatus= async(id:string, status:string)=>{
     try {
       const res= await axios.patch(`${API_URL}/${id}/status/${status}`);
    return res.data
    } catch (error:any) {
        throw new Error(error.response?.data?.message || "Something went wrong");
    }
}
export const deleteTodo= async(id:string)=>{
   try {
     const res= await axios.delete(`/${id}`);
     return res.data
   } catch (error:any) {
            throw new Error(error.response?.data?.message || "Something went wrong");

   }
}