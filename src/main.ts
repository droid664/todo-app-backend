import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const PORT = Number(configService.get<string>('PORT'))

  app.setGlobalPrefix('/api')
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({
    origin: configService.get<string>('ORIGIN'),
  })

  await app.listen(PORT)
}
bootstrap()
