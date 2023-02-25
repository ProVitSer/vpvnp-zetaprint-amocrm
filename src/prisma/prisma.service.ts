import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient as Cdr } from '../../prisma-cdr/generated/cdr';
import { PrismaClient as Sqlite } from '../../prisma/generated/sqlite';

@Injectable()
export class PrismaZetaService extends Sqlite implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  public async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  public async disconnect(): Promise<void> {
    await this.$disconnect();
  }
}

@Injectable()
export class PrismaCdrService extends Cdr implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  public async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  public async disconnect(): Promise<void> {
    await this.$disconnect();
  }
}
