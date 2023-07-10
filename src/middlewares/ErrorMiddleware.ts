import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";

export default function (err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({ 
            name: err.name,
            i18n: err.i18n, 
            message: err.message, 
            stack: err.stack 
        })
    }
    return res.status(500).json({ name: "Error", i18n: "not-found", message: "General Error" })
}