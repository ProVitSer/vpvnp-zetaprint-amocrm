import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { AmocrmUsers } from '@prisma/client';
import { NOT_FOUND_AMOCRM_USER_ERROR } from './amocrm-users.constants';
import { AmocrmUsersService } from './amocrm-users.service';
import { CreateAmocrmUserDto } from './dto/create-amocrm-user.dto';

@Controller('amocrm-users')
export class AmocrmUsersController {
  constructor(private readonly amocrmUsersService: AmocrmUsersService) {}

  @Get()
  async getAmocrmUsers() {
    return await this.amocrmUsersService.getAmocrmUsers();
  }

  @Post('create')
  async createAmocrmUser(@Body() data: CreateAmocrmUserDto): Promise<AmocrmUsers> {
    return await this.amocrmUsersService.createAmocrmUser(data);
  }

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() data: CreateAmocrmUserDto): Promise<AmocrmUsers> {
    const where = { id: Number(id) };
    const user = await this.amocrmUsersService.findAmocrmUser(where);
    if (!user) {
      throw new NotFoundException(NOT_FOUND_AMOCRM_USER_ERROR);
    }
    return this.amocrmUsersService.updateAmocrmUser({
      where,
      data,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<AmocrmUsers> {
    const where = { id: Number(id) };
    const user = await this.amocrmUsersService.findAmocrmUser(where);
    if (!user) {
      throw new NotFoundException(NOT_FOUND_AMOCRM_USER_ERROR);
    }
    return this.amocrmUsersService.deleteAmocrmUser(where);
  }
}
