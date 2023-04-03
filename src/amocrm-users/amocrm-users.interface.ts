import { AmocrmUsers, Prisma } from '../../prisma/generated/sqlite';

export interface AmocrmUsersServiceInterface {
  createAmocrmUser: (data: Prisma.AmocrmUsersCreateInput) => Promise<AmocrmUsers>;
  getAmocrmUsers: () => Promise<AmocrmUsers[]>;
  updateAmocrmUser: (data: UpdateAmocrmUserData) => Promise<AmocrmUsers>;
  deleteAmocrmUser: (data: Prisma.AmocrmUsersWhereUniqueInput) => Promise<AmocrmUsers>;
  findAmocrmUser: (data: Prisma.AmocrmUsersWhereUniqueInput) => Promise<AmocrmUsers>;
}

export interface UpdateAmocrmUserData {
  where: Prisma.AmocrmUsersWhereUniqueInput;
  data: Prisma.AmocrmUsersUpdateInput;
}
