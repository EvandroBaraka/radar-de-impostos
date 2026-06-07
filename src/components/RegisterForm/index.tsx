import { Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../Button";
import { useState } from "react";
import { registerUser } from "../../services/auth";

const registerSchema = z
    .object({
        name: z
            .string()
            .min(2, "O nome deve ter pelo menos 2 caracteres")
            .max(100),
        email: z.email("Utilize um email válido"),
        password: z
            .string()
            .min(6, "A senha deve ter pelo menos 6 caracteres")
            .max(30),
        confirmPassword: z
            .string()
            .min(6, "A confirmação da senha deve ter pelo menos 6 caracteres")
            .max(30),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
    });

type registerData = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<registerData>({
        mode: "onChange",
        criteriaMode: "all",
        resolver: zodResolver(registerSchema),
    });
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const onSubmit: SubmitHandler<registerData> = async (data) => {
        setError(null);

        try {
            await registerUser(data.email, data.password, data.name);
            alert("Cadastro realizado com sucesso!");
            navigate({ to: "/auth/login" });
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Ocorreu um erro ao cadastrar.");
            }
        }
    };

    return (
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f172b]/50 py-6 px-8 backdrop-blur-sm">
            <div className="mb-5 text-left">
                <h2 className="text-[27px] font-bold text-white">
                    Criar conta
                </h2>
                <p className="mt-2 text-[#90a1b9]">
                    É grátis e leva menos de um minuto.
                </p>
            </div>

            <form
                className="space-y-4 text-left"
                onSubmit={handleSubmit(onSubmit)}
            >
                {error && (
                    <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
                        {error}
                    </div>
                )}

                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-white mb-2"
                    >
                        Nome
                    </label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Seu nome"
                        required
                        className="w-full rounded-xl border border-white/10 bg-[#020618] px-4 py-3 text-white placeholder-[#475569] outline-none transition focus:border-white/20 focus:ring-1 focus:ring-white/20"
                        {...register("name")}
                    />
                    {errors?.name && (
                        <p className="text-red-500 text-sm absolute">
                            {errors?.name.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-white mb-2"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="voce@email.com"
                        required
                        className="w-full rounded-xl border border-white/10 bg-[#020618] px-4 py-3 text-white placeholder-[#475569] outline-none transition focus:border-white/20 focus:ring-1 focus:ring-white/20"
                        {...register("email")}
                    />
                    {errors?.email && (
                        <p className="text-red-500 text-sm absolute">
                            {errors?.email.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="pass"
                        className="block text-sm font-medium text-white mb-2"
                    >
                        Senha
                    </label>
                    <input
                        type="password"
                        id="pass"
                        placeholder="Mínimo de 6 caracteres"
                        className="w-full rounded-xl border border-white/10 bg-[#020618] px-4 py-3 text-white placeholder-[#475569] outline-none transition focus:border-white/20 focus:ring-1 focus:ring-white/20"
                        {...register("password")}
                    />
                    {errors?.password && (
                        <p className="text-red-500 text-sm absolute">
                            {errors?.password.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-white mb-2"
                    >
                        Confirme Senha
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Informe a senha novamente"
                        className="w-full rounded-xl border border-white/10 bg-[#020618] px-4 py-3 text-white placeholder-[#475569] outline-none transition focus:border-white/20 focus:ring-1 focus:ring-white/20"
                        {...register("confirmPassword")}
                    />
                    {errors?.confirmPassword && (
                        <p className="text-red-500 text-sm absolute">
                            {errors?.confirmPassword.message}
                        </p>
                    )}
                </div>

                <div className="pt-2">
                    <Button
                        variant="primary"
                        size="md"
                        classes="w-full justify-center"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                    </Button>
                </div>
            </form>

            <div className="mt-6 text-center text-sm text-[#90a1b9]">
                Já tem conta?{" "}
                <Link
                    to="/auth/login"
                    className="font-medium text-white hover:underline"
                >
                    Entrar
                </Link>
            </div>
        </div>
    );
}
