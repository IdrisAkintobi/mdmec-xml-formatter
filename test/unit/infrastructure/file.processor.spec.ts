import { Test } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
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
            fileProcessor.processCSVFile(mockFile, true);
            expect(fileProcessorMock.processCSVFile).toHaveBeenCalledWith(mockFile, true);
            expect(fileProcessorMock.processCSVFile).toHaveBeenCalledTimes(1);
        });
    });
});
