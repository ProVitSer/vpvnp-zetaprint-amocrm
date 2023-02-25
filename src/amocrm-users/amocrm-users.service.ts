import { PrismaCdrService, PrismaZetaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { AmocrmUsers, Prisma } from '../../prisma/generated/sqlite';
import { AmocrmUsersServiceInterface, UpdateAmocrmUserData } from './amocrm-users.interface';

@Injectable()
export class AmocrmUsersService implements AmocrmUsersServiceInterface {
  constructor(private prisma: PrismaZetaService, private cdr: PrismaCdrService) {}

  public async createAmocrmUser(data: Prisma.AmocrmUsersCreateInput): Promise<AmocrmUsers> {
    return this.prisma.amocrmUsers.create({
      data,
    });
  }

  public async getAmocrmUsers(): Promise<AmocrmUsers[]> {
    return this.prisma.amocrmUsers.findMany({});
  }

  public async updateAmocrmUser({ where, data }: UpdateAmocrmUserData): Promise<AmocrmUsers> {
    return this.prisma.amocrmUsers.update({
      data,
      where,
    });
  }

  public async deleteAmocrmUser(data: Prisma.AmocrmUsersWhereUniqueInput): Promise<AmocrmUsers> {
    return this.prisma.amocrmUsers.delete({
      where: data,
    });
  }

  public async findAmocrmUser(data: Prisma.AmocrmUsersWhereUniqueInput): Promise<AmocrmUsers | null> {
    return this.prisma.amocrmUsers.findFirst({
      where: data,
    });
  }
}
