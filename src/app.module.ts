import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'node:path';
import { FileController } from './controllers/file.controller';
import { GenerateController } from './controllers/generate.controller';
import { FileProcessor } from './infrastructure/file.processor';
import { FileService } from './services/file.service';
import { GenerateService } from './services/generate.service';
import appConfig from './config/app.config';

// create folder in temp directory
export const tempDir = join(__dirname, '../temp');
export const zipDir = join(__dirname, '../result.zip');

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig],
            envFilePath: ['.env', '.env.local'],
        }),
    ],
    controllers: [FileController, GenerateController],
    providers: [FileService, GenerateService, { provide: 'FileProcessor', useClass: FileProcessor }],
})
export class AppModule {}
