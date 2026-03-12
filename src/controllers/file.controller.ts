import {
    Body,
    Controller,
    Header,
    HttpCode,
    HttpException,
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
            new ParseFilePipeBuilder().addMaxSizeValidator({ maxSize: 256000 }).build({
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                fileIsRequired: true,
            }),
        )
        file: Express.Multer.File,
        @Body() uploadMmcMecDto: UploadMmcMecDto,
    ): Promise<StreamableFile> {
        // Validate CSV file extension
        if (!file.originalname.toLowerCase().endsWith('.csv')) {
            throw new HttpException('Only CSV files are allowed', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        await this.fileService.processFile(file, uploadMmcMecDto);
        return new StreamableFile(createReadStream(zipDir));
    }
}
