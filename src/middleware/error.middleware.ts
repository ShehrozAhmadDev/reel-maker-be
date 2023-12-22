import { Request, Response, NextFunction } from "express";
export const catchErrors =
  (fn: any) => (request: Request, response: Response, next: NextFunction) =>
    fn(request, response, next).catch((e: any) => {
      const message = e?.message ?? ["Internal Server Error"];

      if (e.response) {
        e.status = e.response.status;
      } else {
        e.status = 500;
      }

      return response.status(e.status).json({ errors: message });
    });
