import { Test } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import { FileVariant } from '../../../src/controllers/dto/file-variant.enum';
import { FileProcessor } from '../../../src/infrastructure/file.processor';

jest.mock('csv-parse');
jest.mock('node:fs/promises');
jest.mock('zip-a-folder');

describe('FileProcessor', () => {
    const fileProcessorMock: MockProxy<FileProcessor> = mock<FileProcessor>();
    let fileProcessor: FileProcessor;

    beforeAll(async () => {
        const testingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: FileProcessor,
                    useValue: fileProcessorMock,
                },
            ],
        }).compile();

        fileProcessor = testingModule.get<FileProcessor>(FileProcessor);
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    describe('processCSVFile', () => {
        it('should be defined', () => {
            expect(fileProcessor.processCSVFile).toBeDefined();
        });

        it('should call parseCsvFile', () => {
            const mockFile = { buffer: 'Buffer' } as unknown as Express.Multer.File;
            fileProcessor.processCSVFile(mockFile, FileVariant.MEC);
            expect(fileProcessorMock.processCSVFile).toHaveBeenCalledWith(mockFile, FileVariant.MEC);
            expect(fileProcessorMock.processCSVFile).toHaveBeenCalledTimes(1);
        });
    });
});
