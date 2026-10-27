import { type ReactNode, useCallback, useEffect, useState } from "react";
import { AuthContext, type User } from "./AuthContext";
import { isTokenExpired } from "../../utils/auth-utils";

type AuthState = {
    user: User | null;
    token: string | null;
    tokenExpired: boolean;
};

function getInitialAuthState(): AuthState {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName") || "";
    const userEmail = localStorage.getItem("userEmail") || "";

    if (!token) {
        return { user: null, token: null, tokenExpired: false };
    }

    if (isTokenExpired(token)) {
        return { user: null, token: null, tokenExpired: true };
    }

    return {
        user: { userName, userEmail },
        token,
        tokenExpired: false,
    };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [auth, setAuth] = useState<AuthState>(getInitialAuthState);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");

        setAuth({
            user: null,
            token: null,
            tokenExpired: false,
        });

        if (window.location.pathname !== "/auth/login") {
            window.location.href = "/auth/login";
        }
    }, []);

    useEffect(() => {
        if (auth.tokenExpired) {
            localStorage.removeItem("token");
            localStorage.removeItem("userName");
            localStorage.removeItem("userEmail");

            if (window.location.pathname !== "/auth/login") {
                window.location.href = "/auth/login";
            }
        }
    }, [auth.tokenExpired]);

    const login = (newToken: string, userName: string, userEmail: string) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("userName", userName);
        localStorage.setItem("userEmail", userEmail);

        setAuth({
            token: newToken,
            user: { userName, userEmail },
            tokenExpired: false,
        });
    };

    return (
        <AuthContext.Provider
            value={{
                user: auth.user,
                token: auth.token,
                isAuthenticated: Boolean(auth.token),
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
