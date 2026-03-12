import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { FileController } from './controllers/file.controller';
import { GenerateController } from './controllers/generate.controller';
import { FileProcessor } from './infrastructure/file.processor';
import { FileService } from './services/file.service';
import { GenerateService } from './services/generate.service';
import appConfig from './config/app.config';

/**
 * Use OS temp directory for temporary files
 * This prevents polluting the project directory and handles cleanup automatically
 * Each process gets a unique temp directory to avoid conflicts
 */
const processId = process.pid;
export const tempDir = join(tmpdir(), `mec-xml-formatter-${processId}`);
export const zipDir = join(tmpdir(), `mec-xml-formatter-${processId}-result.zip`);

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
