import { Inject, Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import { writeFile } from 'node:fs/promises';
import { zip } from 'zip-a-folder';
import { tempDir, zipDir } from '../app.module';
import { MdMecMapper } from '../domain/mappers/mdmec.mapper';
import { ParsedType } from '../domain/types/parsed.type';
import { validateXML, xmlBuilder, xmlPrefix } from './xml.builder';

@Injectable()
export class FileProcessor {
    constructor(@Inject(MdMecMapper) private mdMecMapper: MdMecMapper) {}

    async processCSVFile(file: Express.Multer.File): Promise<void> {
        const parsedCSV = await this.parseCsvFile(file);
        parsedCSV.forEach(this.processDoc.bind(this));

        // compress the temp directory
        await zip(tempDir, zipDir);
    }

    private parseCsvFile(file: Express.Multer.File): Promise<Array<ParsedType>> {
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

    private async processDoc(data: ParsedType): Promise<void> {
        try {
            const objData = this.mdMecMapper.mapFeature(data);
            const xmlData = xmlPrefix + xmlBuilder.build(objData);

            // validate xml
            validateXML(xmlData);

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
}
