const API_URL = import.meta.env.VITE_API_URL;

export const fetchNFCe = async (url: string, token: string) => {
    console.log("Buscando NFC-e pela url:", url);
    const response = await fetch(`${API_URL}/api/receipts/search?url=${url}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const body = await response.text();
        throw new Error(
            `Erro ao buscar NFC-e: ${response.status} ${response.statusText} - ${body}`,
        );
    }
    
    const data = await response.json();
    console.log("Resposta da API:", data);
    return data ?? "";
};
