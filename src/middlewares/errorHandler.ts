import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({
        message: "Erro interno do servidor",
        details: err.message,
    });
};

export default errorHandler;
