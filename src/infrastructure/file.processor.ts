import { Inject, Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import { writeFile } from 'node:fs/promises';
import { zip } from 'zip-a-folder';
import { tempDir, zipDir } from '../app.module';
import { ImageOnlyMdMecMapper } from '../domain/mappers/mdmec-image-only.mapper';
import { MdMecMapper } from '../domain/mappers/mdmec.mapper';
import { ImageOnlyParsedType } from '../domain/types/image-only-parsed.type';
import { ParsedType } from '../domain/types/parsed.type';
import { validateXML, xmlBuilder, xmlPrefix } from './xml.builder';

@Injectable()
export class FileProcessor {
    constructor(
        @Inject(MdMecMapper) private mdMecMapper: MdMecMapper,
        @Inject(ImageOnlyMdMecMapper) private imageOnlyMdMecMapper: ImageOnlyMdMecMapper,
    ) {}

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

    private parseCsvFile(file: Express.Multer.File): Promise<Array<ParsedType | ImageOnlyParsedType>> {
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
            const objData = this.mdMecMapper.map(data);
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

    private async processImageOnlyDoc(data: ImageOnlyParsedType): Promise<void> {
        try {
            const objData = this.imageOnlyMdMecMapper.map(data);
            const xmlData = xmlPrefix + xmlBuilder.build(objData);

            // validate xml
            validateXML(xmlData);

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
