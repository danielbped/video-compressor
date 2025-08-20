import { Controller, Post, Request, UseInterceptors } from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FileService } from './file.service'
import { StatusCodes } from 'http-status-codes'
import File from '../../entity/file.entity'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'

@ApiTags('Vídeos')
@Controller('api')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('videos')
  @ApiOperation({ summary: 'Adicionar um novo vídeo' })
  // @ApiBody({ type: FileSchemaBody })
  @ApiCreatedResponse({
    description: 'Criado com sucesso.',
    // type: UserSchemaResponse,
  })
  @ApiResponse({
    status: StatusCodes.BAD_REQUEST,
    description: 'Dados inválidos.',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`
          cb(null, filename)
        },
      }),
    }),
  )
  async handleFileUpload(@Request() req): Promise<File> {
    const { file, user } = req
    return this.fileService.upload({ file, user })
  }
}