import { PrismaZetaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { AmocrmUsers, Prisma } from '../../prisma/generated/sqlite';
import { AmocrmUsersServiceInterface, UpdateAmocrmUserData } from './amocrm-users.interface';

@Injectable()
export class AmocrmUsersService implements AmocrmUsersServiceInterface {
  constructor(private zeta: PrismaZetaService) {}

  public async createAmocrmUser(data: Prisma.AmocrmUsersCreateInput): Promise<AmocrmUsers> {
    return this.zeta.amocrmUsers.create({
      data,
    });
  }

  public async getAmocrmUsers(): Promise<AmocrmUsers[]> {
    return this.zeta.amocrmUsers.findMany({});
  }

  public async updateAmocrmUser({ where, data }: UpdateAmocrmUserData): Promise<AmocrmUsers> {
    return this.zeta.amocrmUsers.update({
      data,
      where,
    });
  }

  public async deleteAmocrmUser(data: Prisma.AmocrmUsersWhereUniqueInput): Promise<AmocrmUsers> {
    return this.zeta.amocrmUsers.delete({
      where: data,
    });
  }

  public async findAmocrmUser(data: Prisma.AmocrmUsersWhereUniqueInput): Promise<AmocrmUsers | null> {
    return this.zeta.amocrmUsers.findFirst({
      where: data,
    });
  }
}
