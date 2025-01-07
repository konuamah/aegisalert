// src/routes/alerts/disaster/[id]/+page.js
export async function load({ params, fetch }) {
    try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Use environment variable
        const response = await fetch(`${API_BASE_URL}/disasters/disaster-detail/${params.id}/`);
        if (!response.ok) {
            throw new Error(`Failed to fetch disaster details: ${response.statusText}`);
        }
        const disaster = await response.json();
        return {
            disaster
        };
    } catch (error) {
        throw error;
    }
}