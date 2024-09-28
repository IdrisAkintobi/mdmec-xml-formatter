import { Inject, Injectable } from '@nestjs/common';
import { mkdir, rm } from 'node:fs/promises';
import { tempDir, zipDir } from '../app.module';
import { FileVariant } from '../controllers/dto/file-variant.enum';
import { FileProcessor } from '../infrastructure/file.processor';

@Injectable()
export class FileService {
    constructor(@Inject('FileProcessor') private fileProcessor: FileProcessor) {}

    async processFile(file: Express.Multer.File, variant: FileVariant): Promise<void> {
        // delete temp directory and previous result if they exists
        await rm(tempDir, { recursive: true, force: true });
        await rm(zipDir, { recursive: true, force: true });
        // create temp directory if it doesn't exist
        await mkdir(tempDir, { recursive: true });

        // process file
        await this.fileProcessor.processCSVFile(file, variant);
    }
}
