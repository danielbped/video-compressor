import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import File from "../../entity/file.entity";
import { FileController } from "./file.controller";
import { FileService } from "./file.service";

import { UserModule } from "../user/user.module";
import { GCSProvider } from "../../provider/googleCloud.provider";
import { AuthorizationMiddleware } from "../../middleware/authorization.middleware";
import { FileMiddleware } from "../../middleware/file.middleware";
import { FileValidationInterceptor } from "../../interceptor/file.interceptor";

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    UserModule,
  ],
  controllers: [FileController],
  providers: [FileService, GCSProvider, FileValidationInterceptor],
  exports: [FileService],
})
export class FileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FileMiddleware)
      .forRoutes({ path: "api/videos", method: RequestMethod.POST });
    
    consumer
      .apply(AuthorizationMiddleware)
      .forRoutes({ path: "api/videos", method: RequestMethod.GET });
    
    consumer
      .apply(AuthorizationMiddleware)
      .forRoutes({ path: "api/videos/:id", method: RequestMethod.DELETE });
  }
}
