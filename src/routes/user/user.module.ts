import { Module, NestModule, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import User from "../../entity/user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserMiddleware } from "../../middleware/user.middleware";
import { LoginMiddleware } from "../../middleware/login.middleware";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .forRoutes({ path: "api/user", method: RequestMethod.POST })
    consumer
      .apply(LoginMiddleware)
      .forRoutes({ path: "api/login", method: RequestMethod.POST })
  }
}
