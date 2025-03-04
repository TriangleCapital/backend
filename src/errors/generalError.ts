import '../loadEnvironment';
import chalk from 'chalk';
import { NextFunction, Request, Response } from 'express';
import CustomError from './CustomError';

export const notFoundError = (req: Request, res: Response) => {
  res.statusCode = 404;
  res.json({ error: 'Oops! Page not found :(' });
};

export const generalError = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
  const errorCode = error.statusCode ?? 500;

  console.info(chalk.bgRed.white(error.message));

  res.status(errorCode).json({ error: error.privateMessage, publicMessage: error.publicMessage });
};

export function catchControllerError(
  error: any,
  message: string,
  requestBody: any,
  nextFunction: NextFunction,
  errorCode: number = 500
) {
  const finalError = new CustomError(
    errorCode,
    `${error?.publicMessage ?? `${message}: ${error?.message}`}`,
    `${message}: ${error?.message}
    
----------------------------------------------

    Body: ${JSON.stringify(requestBody)}`
  );
  nextFunction(finalError);
}
