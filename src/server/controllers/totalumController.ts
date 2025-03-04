import { NextFunction, Request, Response } from 'express';
import { catchControllerError } from '../../errors/generalError';

export async function controllerFunc(req: Request, res: Response, next: NextFunction) {
  try {
    const { data } = req.body;

    res.status(200).json({ success: true });
  } catch (error) {
    catchControllerError(error, 'Error toggling totalum header content', req.body, next);
  }
}
