import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CofeeModule } from "./cofee/cofee.module";
import { UsersModule } from "./users/users.module";
import { IamModule } from "./iam/iam.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot(), CofeeModule, UsersModule, TypeOrmModule.forRoot({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "",
    password: "pass123",
    database: "postgres",
    autoLoadEntities: true,
    synchronize: true
  }), IamModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
