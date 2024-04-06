import {
  Controller,
  UseInterceptors,
  Post,
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'

@Controller('files')
export class FilesController {
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFile(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image' })],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    console.log(files)
  }
}
