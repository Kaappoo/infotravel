
const API_URL = "http://localhost:3333";

const apiService = {
    getSuggestions: async () => {
        const response = await fetch(`${API_URL}/suggestions`, { cache: "no-store" });
        return response.json();
    },
    
    getHotels: async () => {
        const response = await fetch(`${API_URL}/hotels`, { cache: "no-store" });
        return response.json();
    },
    
    getHotelById: async (id: number) => {
        const response = await fetch(`${API_URL}/hotels/${id}`, { cache: "no-store" });
        return response.json();
    },


}
export default apiService;