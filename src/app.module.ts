import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { config } from 'dotenv';
import { UserModule } from './routes/user/user.module';
import User from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './routes/user/user.controller';
import { UserService } from './routes/user/user.service';
import { UserMiddleware } from './middleware/user.middleware';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';

config();

const {
  MYSQL_DB_USER,
  MYSQL_DB_PASSWORD,
  MYSQL_DB_NAME,
  MYSQL_DB_HOST,
  MYSQL_DB_PORT,
} = process.env;

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: MYSQL_DB_HOST,
      port: Number(MYSQL_DB_PORT),
      username: MYSQL_DB_USER,
      password: MYSQL_DB_PASSWORD,
      database: MYSQL_DB_NAME,
      entities: [User],
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .forRoutes({ path: 'user', method: RequestMethod.POST });

    consumer.apply(AuthenticationMiddleware).forRoutes('conversation', {
      path: 'message',
      method: RequestMethod.POST,
    });
  }
}
