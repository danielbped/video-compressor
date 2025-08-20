import { InjectRepository } from "@nestjs/typeorm"
import ErrorMessage from "../../utils/ErrorMessage"
import File, { ICreateFileDTO } from "../../entity/file.entity"
import { Repository } from "typeorm"
import FileHandler from "../../helper/fileHandler.helper"

export class FileService {
  private fileHandler: FileHandler

  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
  ) {
    this.fileHandler = new FileHandler()
  }

  async upload(data: ICreateFileDTO): Promise<File> {
    const fileData = await this.fileHandler.handle(data.file)

    if (!fileData) {
      throw new Error(ErrorMessage.FileProcessingError)
    }

    const newFile = new File({ ...fileData, user: data.user })

    const createdFile = await this.filesRepository.save(newFile)

    return createdFile
  }
}