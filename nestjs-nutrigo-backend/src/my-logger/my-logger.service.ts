import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MyLoggerService extends ConsoleLogger {
  logToFile(entry: string): void {
    const formattedEntry = `${new Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'Asia/Bangkok',
    }).format(new Date())}\t${entry}\n`;

    try {
      const logsDir = path.join(__dirname, '..', '..', 'logs');

      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
      }

      fs.appendFileSync(path.join(logsDir, 'myLogFile.log'), formattedEntry);
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }
  }

  log(message: any, context?: string): void {
    const entry = `${context || 'APP'}\t${message}`;
    this.logToFile(entry);
    super.log(message, context || this.context);
  }

  error(message: any, stackOrContext?: string): void {
    const entry = `${stackOrContext || 'APP'}\t${message}`;
    this.logToFile(entry);
    super.error(message, stackOrContext || this.context);
  }

  warn(message: any, context?: string): void {
    const entry = `${context || 'APP'}\t${message}`;
    this.logToFile(entry);
    super.warn(message, context || this.context);
  }

  debug(message: any, context?: string): void {
    const entry = `${context || 'APP'}\t${message}`;
    this.logToFile(entry);
    super.debug(message, context || this.context);
  }

  verbose(message: any, context?: string): void {
    const entry = `${context || 'APP'}\t${message}`;
    this.logToFile(entry);
    super.verbose(message, context || this.context);
  }
}
