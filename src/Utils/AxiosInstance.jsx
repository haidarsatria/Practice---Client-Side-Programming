import axios from "axios";

const AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SUPABASE_URL, 
    headers: {
        "Content-Type": "application/json",
        "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
    },
});

console.log("URL Supabase Terbaca:", import.meta.env.VITE_SUPABASE_URL);

export default AxiosInstance;