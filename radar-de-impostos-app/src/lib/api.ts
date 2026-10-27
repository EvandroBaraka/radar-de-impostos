// Função wrapper para fetch que adiciona token e intercepta 401
export const apiFetch = async (url: string | URL, token: string, options: RequestInit = {}) => {

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // Token inválido ou expirado. Limpa o storage e redireciona.
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        
        if (typeof window !== "undefined" && window.location.pathname !== "/auth/login") {
            window.location.href = "/auth/login";
        }
        
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
    }

    return response;
};
