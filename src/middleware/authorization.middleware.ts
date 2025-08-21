import { StatusCodes } from "http-status-codes"
import { NextFunction, Request, Response } from 'express'
import ErrorMessage from "../utils/ErrorMessage"
import { Injectable, NestMiddleware } from "@nestjs/common"
import Token from "../helper/token.helper"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import User from "../entity/user.entity"
import File from "../entity/file.entity"
import { RequestWithUser } from "../interface/helpers.interface"

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  private token: Token

  public constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {
    this.token = new Token()
  }

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization

      if (!token || typeof token !== 'string') {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: ErrorMessage.TokenNotFound });
      }

      const parsedToken = token.split(' ')[1]

      if (!parsedToken) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: ErrorMessage.InvalidToken })
      }

      const loggedUser = this.token.compare(parsedToken)

      if (!loggedUser) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: ErrorMessage.Unauthorized })
      }

      const id = loggedUser?.id

      if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: ErrorMessage.IdNotFound })
      }

      const user = await this.userRepository.findOne({ where: { id } })
      const file = await this.fileRepository.findOne({ where: { user: { id } }, relations: ['user'] })

      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: ErrorMessage.IdNotFound })
      }

      if (file && file.user.id !== user.id) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: ErrorMessage.Unauthorized })
      }

      const isAuthorized = loggedUser.id === user.id

      if (!isAuthorized) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: ErrorMessage.Unauthorized })
      }

      req.user = loggedUser

      return next()
    } catch (err: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: err.message || ErrorMessage.InternalServerError })
    }
  }
}