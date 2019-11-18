import { Response } from "express";

export function notFound(res: Response) {
    res.status(404).json({
        "error": "resource not found"
    })
}
