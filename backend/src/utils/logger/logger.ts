import fs from 'fs';
import { join, resolve } from 'path';
import { default as Pino } from 'pino';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { default as PinoCaller} from 'pino-caller';
import * as dotenv from 'dotenv';
dotenv.config()

const __dirname = dirname(fileURLToPath(import.meta.url));

const logDirectory = join(resolve(`${__dirname}/../../../`), 'logs');

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// const transport = Pino.transport({
  // targets: [
  //   {
  //     // level: 'info',
  //     target: 'pino-pretty',
  //     options: {
  //       destination: logFile,
  //       sync: false
  //     },
  //   },
  // level: 'warn',
  // targets: [
    // {
    //   level: 'warn',
    //   target: 'pino-pretty',
    //   options: {
    //     levelLabel: 'levelLabel',
    //     destination: `${logDirectory}/${process.env.LOGGER_FILE}`,
    //     sync: false
    //   },
    // },
    // {
    //   target: 'pino-pretty',
    // },
    // ...(process.env.NODE_ENV !== 'production'
    //   ? [
    //       {
    //         ...{
    //           level: 'info',
    //           target: 'pino-pretty',
    //           options: {
    //             colorizeObjects: true, //--colorizeObjects
    //             messageFormat: true, // --messageFormat
    //             timestampKey: 'time', // --timestampKey
    //             include: 'level,time', // --include
    //             translateTime: `UTC:yyyy-mm-dd'T'HH:MM:ss'Z'`,
    //           },
    //         },
    //       },
    //     ]
    //   : []),
    
  // ],
  
// });

// const Logger = PinoCaller(Pino(transport));

// export default Logger;

// const winston = require('winston');

import * as winston from 'winston';

const myFormat = winston.format.printf( ({ level, message, timestamp , stack, ...metadata}) => {
  let msg = `${timestamp} [${level}] : ${message}`  
  return msg
});

const Logger = winston.createLogger({
  level: process.env.LOGGER_LEVEL as string,
  format: winston.format.combine(
    winston.format.errors({
      stack: true
    }), 
    winston.format.splat(),
    winston.format.simple(),
    winston.format.timestamp(),
    myFormat
  ),
  transports: [new winston.transports.File(
    {
      filename: `${logDirectory}/${process.env.LOGGER_FILE}`,
      handleExceptions: true
    }
  )],
});

export default Logger;
