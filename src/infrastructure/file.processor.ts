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
        const parsedData = await this.parseCsvFile(file, config);
        switch (config.variant) {
            case FileVariant.ImageOnly:
                await this.processImageOnlyDoc(parsedData as ImageOnlyDataType[]);
                break;
            case FileVariant.MEC:
                await this.processMecDoc(parsedData as mecDataType[]);
                break;
            case FileVariant.MMC:
                await this.processMmcDoc(parsedData as mmcDataType[]);
                break;
            default:
                break;
        }
        await zip(tempDir, zipDir);
    }

    private parseCsvFile(
        file: Express.Multer.File,
        { from, to }: Omit<UploadMmcMecDto, 'variant'>,
    ): Promise<Array<mecDataType | mmcDataType | ImageOnlyDataType>> {
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

    private async processMecDoc(data: mecDataType[]): Promise<void> {
        try {
            for (let i = 0; i < data.length; i++) {
                const xmlData = dataToMECXml(data[i]);

                // write to file
                const fileTitle = data[i].ContentID.split(':')[4].trim();
                const sequenceNumber = data[i].SequenceNumber ? `_${data[i].SequenceNumber}` : '';
                const fileName = `${
                    (fileTitle + sequenceNumber).replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_mec'
                }.xml`;
                const filePath = `${tempDir}/${fileName}`;
                await writeFile(filePath, xmlData);
            }
        } catch (err) {
            throw new Error(`Error processing MEC doc: ${err.message}`);
        }
    }

    private async processImageOnlyDoc(data: ImageOnlyDataType[]): Promise<void> {
        try {
            for (let i = 0; i < data.length; i++) {
                const xmlData = dataToImageOnlyXml(data[i]);

                // write to file
                const fileTitle = data[i].ContentID.split(':')[4].trim();
                const fileName = `${fileTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_image_only'}.xml`;
                const filePath = `${tempDir}/${fileName}`;
                await writeFile(filePath, xmlData);
            }
        } catch (err) {
            throw new Error(`Error processing Image Only doc: ${err.message}`);
        }
    }

    private async processMmcDoc(data: mmcDataType[]): Promise<void> {
        try {
            for (let i = 0; i < data.length; i++) {
                const xmlData = dataToMMCXml(data[i]);

                // write to file
                const fileTitle = data[i].VideoTrackID.split(':')[4].trim();
                const fileName = `${fileTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_mmc'}.xml`;
                const filePath = `${tempDir}/${fileName}`;
                await writeFile(filePath, xmlData);
            }
        } catch (err) {
            throw new Error(`Error processing MMC doc: ${err.message}`);
        }
    }
}
