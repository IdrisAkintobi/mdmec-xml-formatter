import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import {
    dataToImageOnlyXml,
    dataToMECXml,
    dataToMMCXml,
    ImageOnlyDataType,
    mecDataType,
    mmcDataType,
} from 'mdmec-xml-maker';
import { writeFile } from 'node:fs/promises';
import { zip } from 'zip-a-folder';
import { tempDir, zipDir } from '../app.module';
import { UploadMmcMecDto } from '../controllers/dto/file-upload.dto';
import { FileVariant } from '../controllers/dto/file-variant.enum';

@Injectable()
export class FileProcessor {
    constructor() {}

    async processCSVFile(file: Express.Multer.File, config: UploadMmcMecDto): Promise<void> {
        switch (config.variant) {
            case FileVariant.ImageOnly:
                const parsedImageOnlyCSV = await this.parseCsvFile(file, config);
                parsedImageOnlyCSV.forEach(this.processImageOnlyDoc.bind(this));
                break;
            case FileVariant.MEC:
                const parsedMecCSV = await this.parseCsvFile(file, config);
                parsedMecCSV.forEach(this.processMecDoc.bind(this));
                break;
            case FileVariant.MMC:
                const parsedMmcCSV = await this.parseCsvFile(file, config);
                parsedMmcCSV.forEach(this.processMmcDoc.bind(this));
                break;
            default:
                break;
        }
        // compress the temp directory
        await zip(tempDir, zipDir);
    }

    private parseCsvFile(
        file: Express.Multer.File,
        { from, to }: Omit<UploadMmcMecDto, 'variant'>,
    ): Promise<Array<mecDataType | ImageOnlyDataType>> {
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

    private async processMecDoc(data: mecDataType): Promise<void> {
        try {
            const xmlData = dataToMECXml(data);

            // write to file
            const fileTitle = data.ContentID.split(':')[4].trim();
            const sequenceNumber = data.SequenceNumber ? `_${data.SequenceNumber}` : '';
            const fileName = `${(fileTitle + sequenceNumber).replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_mec'}.xml`;
            const filePath = `${tempDir}/${fileName}`;
            await writeFile(filePath, xmlData);
        } catch (err) {
            throw err;
        }
    }

    private async processImageOnlyDoc(data: ImageOnlyDataType): Promise<void> {
        try {
            const xmlData = dataToImageOnlyXml(data);

            // write to file
            const fileTitle = data.ContentID.split(':')[4].trim();
            const fileName = `${fileTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_image_only'}.xml`;
            const filePath = `${tempDir}/${fileName}`;
            await writeFile(filePath, xmlData);
        } catch (err) {
            throw err;
        }
    }

    private async processMmcDoc(data: mmcDataType): Promise<void> {
        try {
            const xmlData = dataToMMCXml(data);

            // write to file
            const fileTitle = data.VideoTrackID.split(':')[4].trim();
            const fileName = `${fileTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_mmc'}.xml`;
            const filePath = `${tempDir}/${fileName}`;
            await writeFile(filePath, xmlData);
        } catch (err) {
            throw err;
        }
    }
}
