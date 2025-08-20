import { Controller, Delete, Get, Post, Request, UseInterceptors } from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FileService } from './file.service'
import { StatusCodes } from 'http-status-codes'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { CreateFileResponse } from '../../interface/response.interface'

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
  async handleFileUpload(@Request() req): Promise<CreateFileResponse> {
    const { file, user } = req
    return this.fileService.upload({ file, user })
  }

  @Get('videos')
  @ApiOperation({ summary: 'Listar vídeos do usuário autenticado' })
  @ApiResponse({
    status: StatusCodes.OK,
    description: 'Lista de vídeos retornada com sucesso.',
    // type: [UserSchemaResponse],
  })
  @ApiResponse({
    status: StatusCodes.UNAUTHORIZED,
    description: 'Usuário não autenticado.',
  })
  async getUserFiles(@Request() req): Promise<CreateFileResponse[]> {
    const { user } = req
    return this.fileService.getFilesByUser(user.id)
  } 

  @Delete('videos/:id')
  @ApiOperation({ summary: 'Deletar um vídeo pelo ID' })
  @ApiResponse({
    status: StatusCodes.NO_CONTENT,
    description: 'Vídeo deletado com sucesso.',
  })
  @ApiResponse({
    status: StatusCodes.NOT_FOUND,
    description: 'Vídeo não encontrado.',
  })
  @ApiResponse({
    status: StatusCodes.UNAUTHORIZED,
    description: 'Usuário não autenticado.',
  })
  async deleteFile(@Request() req): Promise<void> {
    const { params } = req
    const fileId = params.id
    return this.fileService.deleteFile(fileId)
  }
}