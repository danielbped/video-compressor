import { Test, TestingModule } from '@nestjs/testing'
import { FileController } from './file.controller'
import { FileService } from './file.service'
import { CreateFileResponse } from '../../interface/response.interface'

describe('FileController', () => {
  let fileController: FileController
  let fileService: FileService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [
        {
          provide: FileService,
          useValue: {
            upload: jest.fn(),
            getFilesByUser: jest.fn(),
            deleteFile: jest.fn(),
          },
        },
      ],
    }).compile()

    fileController = module.get<FileController>(FileController)
    fileService = module.get<FileService>(FileService)
  })

  describe('handleFileUpload', () => {
    it('should upload a file and return CreateFileResponse', async () => {
      const reqMock = {
        file: {},
        user: { id: 'userId' },
      }
      const result: CreateFileResponse = {
        id: 'fileId',
        user: { id: 'userId' },
        createdAt: new Date(),
        updatedAt: new Date(),
        url: 'http://example.com/fileId'
      }
      jest.spyOn(fileService, 'upload').mockResolvedValue(result)

      expect(await fileController.handleFileUpload(reqMock as any)).toEqual(result)
      expect(fileService.upload).toHaveBeenCalledWith({
        file: reqMock.file,
        user: reqMock.user,
      })
    })
  })

  describe('getUserFiles', () => {
    it('should return an array of files', async () => {
      const reqMock = { user: { id: 'userId' } }
      const result: CreateFileResponse[] = [{
        id: 'fileId1',
        user: { id: 'userId' },
        createdAt: new Date(),
        updatedAt: new Date(),
        url: ''
      }]
      jest.spyOn(fileService, 'getFilesByUser').mockResolvedValue(result as any)

      expect(await fileController.getUserFiles(reqMock as any)).toEqual(result)
      expect(fileService.getFilesByUser).toHaveBeenCalledWith('userId')
    })
  })

  describe('deleteFile', () => {
    it('should call deleteFile with the provided id', async () => {
      const reqMock = { params: { id: 'fileId' } }

      await fileController.deleteFile(reqMock as any)

      expect(fileService.deleteFile).toHaveBeenCalledWith('fileId')
    })
  })
})
