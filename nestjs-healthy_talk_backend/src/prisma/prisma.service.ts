import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { execSync } from 'child_process';
import { URL } from 'url';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error('DATABASE_URL is not defined');

    const parsed = new URL(dbUrl);
    const hostname = parsed.hostname;
    let ip = hostname;
    try {
      const output = execSync(`dig +short A ${hostname}`).toString().trim();
      const lines = output.split('\n');
      for (const line of lines) {
        if (/^\d+\.\d+\.\d+\.\d+$/.test(line)) {
          ip = line;
          break;
        }
      }
    } catch (e) {
      console.warn(
        'DNS Resolution failed, falling back to hostname',
        e.message,
      );
    }

    const pool = new Pool({
      host: ip,
      port: Number(parsed.port) || 5432,
      user: parsed.username,
      password: parsed.password,
      database: parsed.pathname.split('/')[1],
      ssl: {
        rejectUnauthorized: false,
        servername: hostname,
      },
      connectionTimeoutMillis: 10000,
    });

    const adapter = new PrismaPg(pool);
    super({ adapter });

    this.logger.log(`Prisma Service Initialized (Host: ${hostname} -> ${ip})`);
  }

  async onModuleInit() {
    await this.$connect();
  }
}
