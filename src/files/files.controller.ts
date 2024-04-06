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
} from '@nestjs/common'
import { Response } from 'express'
import { FilesInterceptor } from '@nestjs/platform-express'
import { CreateFileDTO } from './dto/createFile.dto'
import { FilesService } from './files.service'
import { createReadStream } from 'fs'
import { join } from 'path'

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
  ) {
    const arr: CreateFileDTO[] = []

    for (const file of files) {
      const filePath = file.destination.replace(/^./, '') + `/${file.filename}`
      const { originalname, mimetype, size, filename } = file

      const dto: CreateFileDTO = {
        originalname,
        mimetype,
        size,
        filePath,
        filename,
      }

      arr.push(dto)
    }

    const uploadFiles = await this.filesService.save(arr)

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
}
