import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { GenerateMECDto } from '../dto/generate/mec.dto';
import { GenerateMMCDto } from '../dto/generate/mmc.dto';
import { GenerateService } from '../services/generate.service';

@Controller('generate')
export class GenerateController {
    constructor(private readonly generateService: GenerateService) {}

    @Post('mec')
    async generateMEC(@Body() data: GenerateMECDto, @Res() res: Response): Promise<void> {
        try {
            const xml = await this.generateService.generateMECXml(data);

            // Set content type and filename
            res.setHeader('Content-Type', 'application/xml');
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="${this.generateService.getFilenameFromContentId(data.contentId)}_mec.xml"`,
            );

            res.status(HttpStatus.OK).send(xml);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: 500,
                message: error.message,
                error: 'Internal Server Error',
            });
        }
    }

    @Post('mmc')
    async generateMMC(@Body() data: GenerateMMCDto, @Res() res: Response): Promise<void> {
        try {
            const xml = await this.generateService.generateMMCXml(data);

            // Extract filename from video location
            const filename = this.generateService.getFilenameFromUrl(data.video[0]?.location || 'media');

            res.setHeader('Content-Type', 'application/xml');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}_mmc.xml"`);

            res.status(HttpStatus.OK).send(xml);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: 500,
                message: error.message,
                error: 'Internal Server Error',
            });
        }
    }
}
