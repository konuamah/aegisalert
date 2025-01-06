// src/routes/alerts/disaster/[id]/+page.js
export async function load({ params, fetch }) {
    try {
        const response = await fetch(`http://localhost:8000/disasters/disaster-detail/${params.id}/`);
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