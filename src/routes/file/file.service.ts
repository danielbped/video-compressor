import { InjectRepository } from "@nestjs/typeorm"
import ErrorMessage from "../../utils/ErrorMessage"
import File from "../../entity/file.entity"
import { Repository } from "typeorm"
import FileHandler from "../../helper/fileHandler.helper"
import { GCSProvider } from "../../provider/googleCloud.provider"
import { CreateFileResponse } from "../../interface/response.interface"
import { File as MulterFile } from 'multer';

export class FileService {
  private fileHandler: FileHandler

  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
    private googleCloudProvider: GCSProvider
  ) {
    this.fileHandler = new FileHandler(this.googleCloudProvider)
  }

  async upload(data: { files: MulterFile[]; user: any }): Promise<CreateFileResponse[]> {
    if (!data.files || data.files.length === 0) {
      throw new Error(ErrorMessage.NoFileProvided)
    }

    const results: CreateFileResponse[] = []

    for (const file of data.files) {
      const fileData = await this.fileHandler.create(file)

      if (!fileData) {
        throw new Error(ErrorMessage.FileProcessingError)
      }

      const newFile = new File({ ...fileData, user: data.user })
      const createdFile = await this.filesRepository.save(newFile)

      results.push({
        ...createdFile,
        user: {
          id: createdFile.user.id,
          email: createdFile.user.email,
          firstName: createdFile.user.firstName,
          lastName: createdFile.user.lastName,
        },
      })
    }
    return results
  }

  async deleteFile(fileId: string): Promise<void> {
    const file = await this.filesRepository.findOne({ where: { id: fileId } })
    if (!file) {
      throw new Error(ErrorMessage.FileNotFound)
    }

    await this.fileHandler.delete(file.path)
    await this.filesRepository.remove(file)
  }

  async getFilesByUser(userId: string): Promise<File[]> {
    return this.filesRepository.find(
      { 
        where: { user: { id: userId } },
        relations: ['user'],
        select: {
          user: {
            email: true,
            firstName: true,
            lastName: true,
            id: true,
          }
        }
      }
    ) || []
  }
}