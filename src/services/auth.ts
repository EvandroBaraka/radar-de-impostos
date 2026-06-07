const API_URL = import.meta.env.VITE_API_URL;

export async function loginUser(email: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Erro ao realizar login");
    }

    return data; // Retorna { token, userID }
}

export async function registerUser(email: string, password: string, name?: string) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Erro ao realizar cadastro");
    }

    return data;
}
