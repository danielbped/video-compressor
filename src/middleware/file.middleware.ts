import { StatusCodes } from "http-status-codes"
import { NextFunction, Response } from 'express'
import { Injectable, NestMiddleware } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import Token from "../helper/token.helper"
import User from "../entity/user.entity"
import ErrorMessage from "../utils/ErrorMessage"
import { RequestWithUser } from "../interface/helpers.interface"

@Injectable()
export class FileMiddleware implements NestMiddleware {
  private token: Token

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.token = new Token()
  }

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization

      if (!token) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ErrorMessage.MissingRequiredParameters,
        })
      }

      const parsedToken = token.split(' ')[1]
      const user = this.token.compare(parsedToken)

      if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ErrorMessage.MissingRequiredParameters,
        })
      }

      const userExists = await this.userRepository.findOne({ where: { id: user.id } })

      if (!userExists) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ErrorMessage.FileNotFound,
        })
      }

      const loggedUser = this.token.compare(parsedToken)

      if (!loggedUser || loggedUser.id !== userExists.id) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: ErrorMessage.Unauthorized,
        })
      }

      req.user = loggedUser

      next()
    } catch (err: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: err.message || ErrorMessage.InternalServerError })
    }
  }
}
