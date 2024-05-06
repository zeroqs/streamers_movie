import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Movie } from "../movies/moviesEntity/movieEntity";

export const dbConfig = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: "postgres",
    host: configService.get("postgresHost"),
    port: Number(configService.get("postgresPort")),
    username: configService.get("postgresUser"),
    password: configService.get("postgresPassword"),
    database: configService.get("postgresDB"),
    synchronize: true,
    autoLoadModels: true,
    entities: [Movie],
  }),
});
