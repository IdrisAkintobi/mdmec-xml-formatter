import {
    Body,
    Controller,
    Header,
    HttpCode,
    HttpStatus,
    ParseFilePipeBuilder,
    Post,
    StreamableFile,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'node:fs';
import { zipDir } from '../app.module';
import { FileService } from '../services/file.service';
import { UploadMmcMecDto } from './dto/file-upload.dto';

@Controller('upload')
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @UseInterceptors(FileInterceptor('file'))
    @Post('/')
    @HttpCode(HttpStatus.OK)
    @Header('Content-Disposition', 'attachment; filename="result.zip"')
    async uploadMDMECRecordFile(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({ fileType: 'csv' })
                .addMaxSizeValidator({ maxSize: 256000 })
                .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
        )
        file: Express.Multer.File,
        @Body() uploadMmcMecDto: UploadMmcMecDto,
    ): Promise<StreamableFile> {
        await this.fileService.processFile(file, uploadMmcMecDto.variant);
        return new StreamableFile(createReadStream(zipDir));
    }
}
