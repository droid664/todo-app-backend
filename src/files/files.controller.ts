import {
  Controller,
  UseInterceptors,
  Post,
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator,
  Param,
  Get,
  NotFoundException,
  Res,
  StreamableFile,
  Delete,
  ParseIntPipe,
  Body,
} from '@nestjs/common'
import { Response } from 'express'
import { FilesInterceptor } from '@nestjs/platform-express'
import { CreateFileDTO } from './dto/createFile.dto'
import { FilesService } from './files.service'
import { createReadStream } from 'fs'
import { join } from 'path'
import { EntityDataDTO } from './dto/entityData.dto'

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image' })],
      }),
    )
    files: Array<Express.Multer.File>,
    @Body() entityData: EntityDataDTO,
  ) {
    const arr: CreateFileDTO[] = []

    for (const file of files) {
      const filePath = file.destination.replace(/^./, '') + `/${file.filename}`
      const downloadURL = '/files' + filePath
      const { originalname, mimetype, size, filename } = file

      const dto: CreateFileDTO = {
        originalname,
        mimetype,
        size,
        filePath,
        filename,
        downloadURL,
      }

      arr.push(dto)
    }

    const uploadFiles = await this.filesService.save(arr, entityData)

    return uploadFiles
  }

  @Get('/upload/:fileName')
  async getFile(
    @Res({ passthrough: true }) res: Response,
    @Param('fileName') fileName: string,
  ): Promise<StreamableFile> {
    const file = await this.filesService.findOne(fileName)

    if (!file) {
      throw new NotFoundException('Файл не найден!')
    }

    const fileStream = createReadStream(join(process.cwd(), file.filePath))

    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${file.originalname}"`,
    })

    return new StreamableFile(fileStream)
  }

  @Delete('/:id')
  async deleteFile(@Param('id', new ParseIntPipe()) id: number) {
    const findFile = await this.filesService.findOneById(id)

    if (!findFile) {
      throw new NotFoundException('Файл не найден!')
    }

    return await this.filesService.deleteFile(id)
  }
}
