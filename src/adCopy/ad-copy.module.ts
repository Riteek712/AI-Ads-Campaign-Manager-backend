import { DatabaseModule } from "src/database/database.module";
import { AdCopyService } from "./ad-copy.service";
import { AdCopyController } from "./ad-copy.controller";
import { Module } from "@nestjs/common";

@Module({
    imports: [DatabaseModule],
    controllers: [AdCopyController],
    providers: [AdCopyService],
})
export class AdCopyModule{}