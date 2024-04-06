import {
  Controller,
  UseInterceptors,
  Post,
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { CreateFileDTO } from './dto/createFile.dto'
import { FilesService } from './files.service'

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
}
