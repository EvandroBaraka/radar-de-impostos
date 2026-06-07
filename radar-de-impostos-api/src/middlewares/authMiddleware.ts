import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Usuário não autenticado. Token não fornecido." });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || "secret");
        req.user = payload as any;
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido." });
    }
};

export default authMiddleware;
