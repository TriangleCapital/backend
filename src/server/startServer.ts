import chalk from 'chalk';
import app from './index';
import CustomError from '../errors/CustomError';

const startServer = (port: number) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.info(chalk.bgGreen.white(`Server listening on port ${port}`));
      resolve(true);
    });

    server.timeout = 500000;

    server.on('error', (error: CustomError) => {
      console.info(chalk.bgRed.white('Error when starting the server'));
      if (error.code === 'EADDRINUSE') {
        console.info(chalk.bgRed.white(`Port ${port} is in use`));
      }
      reject(error);
    });
  });

export default startServer;
