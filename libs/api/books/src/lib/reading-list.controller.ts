import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Post,Put } from '@nestjs/common';
import { Book } from '@tmo/shared/models';
import { ReadingListService } from './reading-list.service';

@Controller()
export class ReadingListController {
  constructor(private readonly readingList: ReadingListService) {}

  @Get('/reading-list/')
  async getReadingList() {
    return await this.readingList.getList();
  }

  @Post('/reading-list/')
  async addToReadingList(@Body() item: Book) {
    return await this.readingList.addBook(item);
  }

  @Delete('/reading-list/:id')
  async removeFromReadingList(@Param() params) {
    return await this.readingList.removeBook(params.id);
  }

  @Put('/reading-list/:id/finished')
async markAsFinished(@Param('id') id: string) {
  try {
    await this.readingList.markBookAsFinished(id);

    return {
      message: `Marked book with ID ${id} as finished`,
    };
  } catch (error) {
    throw new InternalServerErrorException('Failed to mark book as finished');
  }
}
}
