import { Inject, Injectable } from '@nestjs/common';
import { mkdir, rm } from 'node:fs/promises';
import { tempDir, zipDir } from '../app.module';
import { FileProcessor } from '../infrastructure/file.processor';

@Injectable()
export class FileService {
    constructor(@Inject('FileProcessor') private fileProcessor: FileProcessor) {}

    async processFile(file: Express.Multer.File, isImageOnly = false): Promise<void> {
        // delete temp directory and previous result if they exists
        await rm(tempDir, { recursive: true, force: true });
        await rm(zipDir, { recursive: true, force: true });
        // create temp directory if it doesn't exist
        await mkdir(tempDir, { recursive: true });

        // process file
        await this.fileProcessor.processCSVFile(file, isImageOnly);
    }
}
