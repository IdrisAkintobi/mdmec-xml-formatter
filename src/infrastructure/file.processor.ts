import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import {
    dataToImageOnlyXml,
    dataToMECXml,
    dataToMMCXml,
    ImageOnlyCSVData,
    MECCSVData,
    MMCCSVData,
} from 'mec-mmc-maker';
import { writeFile } from 'node:fs/promises';
import { zip } from 'zip-a-folder';
import { tempDir, zipDir } from '../app.module';
import { UploadMmcMecDto } from '../controllers/dto/file-upload.dto';
import { FileVariant } from '../controllers/dto/file-variant.enum';
import { extractCsvHeaders, validateFileType } from './file-type-detector';

@Injectable()
export class FileProcessor {
    constructor() {}

    async processCSVFile(file: Express.Multer.File, config: UploadMmcMecDto): Promise<void> {
        // Validate file type before processing
        this.validateFileTypeMatch(file, config.variant);

        const parsedData = await this.parseCsvFile(file, config);
        switch (config.variant) {
            case FileVariant.ImageOnly:
                await this.processImageOnlyDoc(parsedData as ImageOnlyCSVData[]);
                break;
            case FileVariant.MEC:
                await this.processMecDoc(parsedData as MECCSVData[]);
                break;
            case FileVariant.MMC:
                await this.processMmcDoc(parsedData as MMCCSVData[]);
                break;
            default:
                break;
        }
        await zip(tempDir, zipDir);
    }

    /**
     * Validate that uploaded CSV matches the expected file type
     */
    private validateFileTypeMatch(file: Express.Multer.File, expectedType: FileVariant): void {
        try {
            const headers = extractCsvHeaders(file.buffer);
            validateFileType(headers, expectedType);
        } catch (error) {
            throw new Error(`File validation failed: ${error.message}`);
        }
    }

    private parseCsvFile(
        file: Express.Multer.File,
        { from, to }: Omit<UploadMmcMecDto, 'variant'>,
    ): Promise<Array<MECCSVData | MMCCSVData | ImageOnlyCSVData>> {
        const pointer = { ...(from && { from }), ...(to && { to }) };
        return new Promise((resolve, reject) => {
            parse(file.buffer, { delimiter: ',', columns: true, trim: true, ...pointer }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    private async processMecDoc(data: MECCSVData[]): Promise<void> {
        let i = 0;
        try {
            for (; i < data.length; i++) {
                const xmlData = dataToMECXml(data[i]);

                // write to file - extract filename safely from ContentID
                const contentIdParts = data[i].ContentID?.split(':') || [];
                const fileTitle = contentIdParts[4] || contentIdParts[contentIdParts.length - 1] || 'content';
                const sequenceNumber = data[i].SequenceNumber ? `_${data[i].SequenceNumber}` : '';
                const fileName = `${
                    (fileTitle.trim() + sequenceNumber).replaceAll(/[^a-z0-9]/gi, '_').toLowerCase() + '_mec'
                }.xml`;
                const filePath = `${tempDir}/${fileName}`;
                await writeFile(filePath, xmlData);
            }
        } catch (err) {
            console.log('An error occurred at index', i + 2, err);
            throw new Error(`Error processing MEC doc at line ${i + 2}: ${err.message}`);
        }
    }

    private async processImageOnlyDoc(data: ImageOnlyCSVData[]): Promise<void> {
        let i = 0;
        try {
            for (; i < data.length; i++) {
                const xmlData = dataToImageOnlyXml(data[i]);

                // write to file - extract filename safely from ContentID
                const contentIdParts = data[i].ContentID?.split(':') || [];
                const fileTitle = contentIdParts[4] || contentIdParts[contentIdParts.length - 1] || 'content';
                const fileName = `${
                    fileTitle
                        .trim()
                        .replaceAll(/[^a-z0-9]/gi, '_')
                        .toLowerCase() + '_image_only'
                }.xml`;
                const filePath = `${tempDir}/${fileName}`;
                await writeFile(filePath, xmlData);
            }
        } catch (err) {
            console.log('An error occurred at index', i + 2, err);
            throw new Error(`Error processing Image Only doc at line ${i + 2}: ${err.message}`);
        }
    }

    private async processMmcDoc(data: MMCCSVData[]): Promise<void> {
        let i = 0;
        try {
            for (; i < data.length; i++) {
                const xmlData = dataToMMCXml(data[i]);

                // write to file - extract filename safely from VideoTrackID
                const videoTrackIdParts = data[i].VideoTrackID?.split(':') || [];
                const fileTitle = videoTrackIdParts[4] || videoTrackIdParts[videoTrackIdParts.length - 1] || 'media';
                const fileName = `${
                    fileTitle
                        .trim()
                        .replaceAll(/[^a-z0-9]/gi, '_')
                        .toLowerCase() + '_mmc'
                }.xml`;
                const filePath = `${tempDir}/${fileName}`;
                await writeFile(filePath, xmlData);
            }
        } catch (err) {
            console.log('An error occurred at index', i + 2, err);
            throw new Error(`Error processing MMC doc at line ${i + 2}: ${err.message}`);
        }
    }
}
