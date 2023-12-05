import { ConfigModule } from "@nestjs/config";
import config from "./config";

export const configModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [config],
  envFilePath: "../../.env",
});
