import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import { DataType, ImageOnlyDataType, dataToImageOnlyXml, dataToMdmecXml } from 'mdmec-xml-maker';
import { writeFile } from 'node:fs/promises';
import { zip } from 'zip-a-folder';
import { tempDir, zipDir } from '../app.module';

@Injectable()
export class FileProcessor {
    constructor() {}

    async processCSVFile(file: Express.Multer.File, isImageOnly: boolean): Promise<void> {
        if (isImageOnly) {
            const parsedCSV = await this.parseCsvFile(file);
            parsedCSV.forEach(this.processImageOnlyDoc.bind(this));
        } else {
            const parsedCSV = await this.parseCsvFile(file);
            parsedCSV.forEach(this.processDoc.bind(this));
        }

        // compress the temp directory
        await zip(tempDir, zipDir);
    }

    private parseCsvFile(file: Express.Multer.File): Promise<Array<DataType | ImageOnlyDataType>> {
        return new Promise((resolve, reject) => {
            parse(file.buffer, { delimiter: ',', columns: true, trim: true }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    private async processDoc(data: DataType): Promise<void> {
        try {
            const xmlData = dataToMdmecXml(data);

            // write to file
            const fileTitle = data.TitleDisplay.split(';')[0].trim();
            const sequenceNumber = data.SequenceNumber ? `_${data.SequenceNumber}` : '';
            const fileName = `${(fileTitle + sequenceNumber).replace(/[^a-z0-9]/gi, '_').toLowerCase()}.xml`;
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
            const fileTitle = data.ArtReference.split(';')[0].trim();
            const fileName = `${fileTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.xml`;
            const filePath = `${tempDir}/${fileName}`;
            await writeFile(filePath, xmlData);
        } catch (err) {
            throw err;
        }
    }
}
