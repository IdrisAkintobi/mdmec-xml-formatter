import { Module } from '@nestjs/common';
import { join } from 'node:path';
import { FileController } from './controllers/file.controller';
import { ImageOnlyMdMecMapper } from './domain/mappers/mdmec-image-only.mapper';
import { MdMecMapper } from './domain/mappers/mdmec.mapper';
import { FileProcessor } from './infrastructure/file.processor';
import { FileService } from './services/file.service';

// create folder in temp directory
export const tempDir = join(__dirname, '../temp');
export const zipDir = join(__dirname, '../result.zip');

@Module({
    imports: [],
    controllers: [FileController],
    providers: [FileService, MdMecMapper, ImageOnlyMdMecMapper, FileProcessor],
})
export class AppModule {}
