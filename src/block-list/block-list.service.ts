import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { AddBlockItemDto, BlockListQueryDto } from './dto';

@Injectable()
export class BlockListService {
  constructor(private readonly dbService: DbService) {}

  create(userId: number) {
    return this.dbService.blockList.create({
      data: { ownerId: userId },
    });
  }

  getByUser(userId: number, query: BlockListQueryDto) {
    return this.dbService.blockList.findUniqueOrThrow({
      where: { ownerId: userId },
      include: {
        items: {
          where: { data: { contains: query.q, mode: 'insensitive' } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async addItem(userId: number, data: AddBlockItemDto) {
    const blockList = await this.dbService.blockList.findUniqueOrThrow({
      where: { ownerId: userId },
    });
    return this.dbService.blockItem.create({
      data: {
        blockListId: blockList.id,
        ...data,
      },
    });
  }

  async removeItem(userId: number, itemId: number) {
    const blockList = await this.dbService.blockList.findFirstOrThrow({
      where: { ownerId: userId },
    });

    return this.dbService.blockItem.delete({
      where: {
        blockListId: blockList.id,
        id: itemId,
      },
    });
  }
}
