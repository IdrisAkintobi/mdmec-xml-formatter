import { Inject, Injectable } from '@nestjs/common';
import { FileProcessor } from '../infrastructure/file.processor';

@Injectable()
export class FileService {
    constructor(@Inject(FileProcessor) private fileProcessor: FileProcessor) {}

    async processFile(file: Express.Multer.File): Promise<void> {
        await this.fileProcessor.processCSVFile(file);
    }
}
