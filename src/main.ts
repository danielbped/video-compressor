import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cors from 'cors'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions = {
    origin: /(localhost)/,
    optionsSuccessStatus: 200,
    methods: 'GET, HEAD, PUT, POST, DELETE',
  }

  const config = new DocumentBuilder()
    .setTitle('Video Compressor API')
    .setDescription('The Video Compressor API description')
    .setVersion('1.0.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  app.use(cors(corsOptions))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
