import { Module } from '@nestjs/common';
import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { AppController } from './controllers/app.controller';
import { FileController } from './controllers/file.controller';
import { MdMecMapper } from './domain/mappers/mdmec.mapper';
import { FileProcessor } from './infrastructure/file.processor';
import { AppService } from './services/app.service';
import { FileService } from './services/file.service';

// create folder in temp directory
export const tempDir = join(__dirname, '../temp');
export const zipDir = join(__dirname, '../result.zip');

@Module({
    imports: [],
    controllers: [AppController, FileController],
    providers: [AppService, FileService, MdMecMapper, FileProcessor],
})
export class AppModule {
    async onApplicationBootstrap() {
        // delete temp directory and previous result if they exists
        await rm(tempDir, { recursive: true, force: true });
        await rm(zipDir, { recursive: true, force: true });
        // create temp directory if it doesn't exist
        await mkdir(tempDir, { recursive: true });
    }

    async onApplicationShutdown() {
        // delete temp directory and previous result if they exists
        await rm(tempDir, { recursive: true, force: true });
        await rm(zipDir, { recursive: true, force: true });
    }
}
