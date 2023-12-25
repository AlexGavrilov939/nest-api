import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { AccountService } from '../account/account.service';
import { BlockListService } from '../block-list/block-list.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly dbService: DbService,
    private readonly accountService: AccountService,
    private readonly blockListService: BlockListService
  ) {}

  findByEmail(email: string) {
    return this.dbService.user.findFirst({ where: { email } });
  }

  async create(email: string, hash: string, salt: string) {
    const user = await this.dbService.user.create({
      data: { email, hash, salt },
    });
    await this.accountService.create(user.id);
    await this.blockListService.create(user.id);

    return user;
  }
}
