import { InjectRepository } from "@nestjs/typeorm"
import ErrorMessage from "../../utils/ErrorMessage"
import File, { ICreateFileDTO } from "../../entity/file.entity"
import { Repository } from "typeorm"
import FileHandler from "../../helper/fileHandler.helper"
import { GCSProvider } from "../../provider/googleCloud.provider"
import { CreateFileResponse } from "../../interface/response.interface"

export class FileService {
  private fileHandler: FileHandler

  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
    private googleCloudProvider: GCSProvider
  ) {
    this.fileHandler = new FileHandler(this.googleCloudProvider)
  }

  async upload(data: ICreateFileDTO): Promise<CreateFileResponse> {
    const fileData = await this.fileHandler.handle(data.file)

    if (!fileData) {
      throw new Error(ErrorMessage.FileProcessingError)
    }

    const newFile = new File({ ...fileData, user: data.user })

    const createdFile = await this.filesRepository.save(newFile)

    return { 
      ...createdFile,
      user: {
        id: createdFile.user.id,
        email: createdFile.user.email,
        firstName: createdFile.user.firstName,
        lastName: createdFile.user.lastName,
      }
    }
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
    )
  }
}