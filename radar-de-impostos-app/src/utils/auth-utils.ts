// Função auxiliar para verificar se o token expirou decodificando o payload
export const isTokenExpired = (token: string) => {
    if (!token) return true;
    try {
        const payloadBase64 = token.split('.')[1];
        const decodedJson = atob(payloadBase64);
        const payload = JSON.parse(decodedJson);
        const exp = payload.exp;
        if (!exp) return false;
        return exp * 1000 < Date.now();
    } catch (e) {
        console.error('Erro ao decodificar o token:', e);
        return true;
    }
}