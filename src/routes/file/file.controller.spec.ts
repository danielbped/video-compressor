import { Test, TestingModule } from '@nestjs/testing'
import { FileController } from './file.controller'
import { FileService } from './file.service'
import { CreateFileResponse } from '../../interface/response.interface'

describe('FileController', () => {
  let controller: FileController
  let service: FileService

  const mockFileResponse: CreateFileResponse = {
    id: 'file-123',
    user: { id: 'user-1', email: 'test@test.com' },
    createdAt: new Date(),
    updatedAt: new Date(),
    original_url: 'http://original.com/video.mp4',
    compressed_url: 'http://compressed.com/video.mp4',
    compression_percentage: 50,
    original_size: 1000,
    compressed_size: 500,
  }

  const mockFileService = {
    upload: jest.fn(),
    getFilesByUser: jest.fn(),
    deleteFile: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [
        {
          provide: FileService,
          useValue: mockFileService,
        },
      ],
    }).compile()

    controller = module.get<FileController>(FileController)
    service = module.get<FileService>(FileService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('handleFilesUpload', () => {
    it('deve chamar o service.upload com os arquivos e usuário corretos', async () => {
      mockFileService.upload.mockResolvedValue([mockFileResponse])

      const req = {
        files: ['video1.mp4'],
        user: { id: 'user-1' },
      }

      const result = await controller.handleFilesUpload(req)

      expect(service.upload).toHaveBeenCalledWith({
        files: req.files,
        user: req.user,
      })
      expect(result).toEqual([mockFileResponse])
    })
  })

  describe('getUserFiles', () => {
    it('deve retornar os vídeos do usuário autenticado', async () => {
      mockFileService.getFilesByUser.mockResolvedValue([mockFileResponse])

      const req = { user: { id: 'user-1' } }

      const result = await controller.getUserFiles(req)

      expect(service.getFilesByUser).toHaveBeenCalledWith('user-1')
      expect(result).toEqual([mockFileResponse])
    })
  })

  describe('deleteFile', () => {
    it('deve chamar o service.deleteFile com o id correto', async () => {
      mockFileService.deleteFile.mockResolvedValue(undefined)

      const req = { params: { id: 'file-123' } }

      await controller.deleteFile(req)

      expect(service.deleteFile).toHaveBeenCalledWith('file-123')
    })
  })
})
