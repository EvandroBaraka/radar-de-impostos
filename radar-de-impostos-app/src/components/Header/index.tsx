import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { User, LogOut } from "lucide-react";
import { Button } from "../Button";
import { Logo } from "../Logo";

export const Header = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        try {
            return Boolean(localStorage.getItem("token"));
        } catch {
            return false;
        }
    });

    const handleLogout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        setIsDropdownOpen(false);

        navigate({ to: "/" });
    };

    return (
        <header className="mx-auto flex justify-between items-center max-w-6xl w-full p-6">
            <Link to="/">
                <Logo />
            </Link>

            <div className="flex items-center gap-2">
                {isAuthenticated ? (
                    <div className="relative">
                        {/* Avatar do Usuário */}
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1e293b] hover:bg-[#334155] border border-[#334155] transition-colors cursor-pointer"
                        >
                            <User className="w-5 h-5 text-[#90a1b9]" />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsDropdownOpen(false)}
                                ></div>
                                <div className="absolute right-0 mt-2 w-48 bg-[#0f172b] border border-[#334155] rounded-xl shadow-lg py-2 flex flex-col z-50">
                                    <div className="px-4 py-2 border-b border-[#334155] mb-2">
                                        <p className="text-sm font-medium text-white">
                                            Minha Conta
                                        </p>
                                    </div>
                                    <Link
                                        to="/dashboard"
                                        className="px-4 py-2 text-sm text-[#90a1b9] hover:bg-[#1e293b] hover:text-white text-left transition-colors"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        Meu Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-sm text-red-400 hover:bg-[#1e293b] text-left flex items-center gap-2 transition-colors w-full cursor-pointer"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sair
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    // Botões exibidos se não estiver logado
                    <div className="flex items-center gap-3">
                        <Link to="/auth/login">
                            <Button variant="secondary" size="sm">
                                Entrar
                            </Button>
                        </Link>
                        <Link to="/auth/register">
                            <Button variant="primary" size="sm">
                                Cadastrar
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};
