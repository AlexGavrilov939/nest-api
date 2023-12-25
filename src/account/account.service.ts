import { Injectable } from '@nestjs/common';
import { PatchAccountDto } from './dto';
import { DbService } from '../db/db.service';

@Injectable()
export class AccountService {
  constructor(private readonly dbService: DbService) {}

  async create(userId: number) {
    await this.dbService.account.create({
      data: {
        ownerId: userId,
        isBlockingEnabled: false,
      },
    });
  }

  async getAccount(userId: number) {
    return this.dbService.account.findFirstOrThrow({
      where: { ownerId: userId },
    });
  }

  async patchAccount(userId: number, patch: PatchAccountDto) {
    return this.dbService.account.update({
      where: { ownerId: userId },
      data: { ...patch },
    });
  }
}
