import { ApiProperty } from '@nestjs/swagger'
import { UserSchema } from './user.schema'

export class FileSchemaBody {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'Arquivos de vídeo a serem enviados.',
    nullable: false,
  })
  files: any[]
}

export class FileSchema {
  @ApiProperty({
    type: String,
    example: '123e614174000',
    description: 'ID do arquivo.',
  })
  id: string

  @ApiProperty({
    type: () => UserSchema,
    description: 'Usuário dono do arquivo.',
    example: {
      id: '42',
      firstName: 'Douglas',
      lastName: 'Adams',
      email: 'douglasadams@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })
  user: UserSchema

  @ApiProperty({
    type: Date,
    example: new Date(),
    description: 'Data de criação.',
  })
  createdAt: Date

  @ApiProperty({
    type: Date,
    example: new Date(),
    description: 'Data de atualização.',
  })
  updatedAt: Date

  @ApiProperty({
    type: String,
    example: 'https://storage.googleapis.com/bucket/123e614174000.mp4',
    description: 'URL pública do arquivo.',
  })
  url: string

  @ApiProperty({
    type: String,
    example: 'uploads/123e614174000.mp4',
    description: 'Caminho do arquivo no bucket/storage.',
  })
  path: string

  @ApiProperty({
    type: String,
    example: 'video.mp4',
    description: 'Nome original do arquivo.',
  })
  filename: string
}

export class FileSchemaResponse {
  @ApiProperty({
    type: [FileSchema],
    description: 'Lista de arquivos criados.',
  })
  files: FileSchema[]
}
