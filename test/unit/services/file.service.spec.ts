import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import { mkdir, rm } from 'node:fs/promises';
import { tempDir, zipDir } from '../../../src/app.module';
import { FileProcessor } from '../../../src/infrastructure/file.processor';
import { FileService } from '../../../src/services/file.service';

jest.mock('node:fs/promises');

describe('FileService', () => {
    let testingModule: TestingModule;
    let fileService: FileService;
    const fileProcessorMock: MockProxy<FileProcessor> = mock<FileProcessor>();

    beforeAll(async () => {
        testingModule = await Test.createTestingModule({
            providers: [{ provide: 'FileProcessor', useValue: fileProcessorMock }, FileService],
        }).compile();

        fileService = testingModule.get<FileService>(FileService);
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    const fileMock: any = {
        buffer: 'Buffer',
        filename: 'test.csv',
    };

    describe('processFile', () => {
        it('should process file with default options', async () => {
            // Mock the processCSVFile method of FileProcessor
            fileProcessorMock.processCSVFile.mockResolvedValue(undefined);

            await fileService.processFile(fileMock);

            // Assert previous result and temp directory are deleted
            expect(rm).toHaveBeenCalledWith(tempDir, { recursive: true, force: true });
            expect(rm).toHaveBeenCalledWith(zipDir, { recursive: true, force: true });
            expect(mkdir).toHaveBeenCalledWith(tempDir, { recursive: true });
            // Assert processCSVFile is called with the correct arguments
            expect(fileProcessorMock.processCSVFile).toHaveBeenCalledWith(fileMock, false);
        });

        it('should process file with isImageOnly option', async () => {
            // Mock the processCSVFile method of FileProcessor
            fileProcessorMock.processCSVFile.mockResolvedValue(undefined);

            await fileService.processFile(fileMock, true);

            // Assert previous result and temp directory are deleted
            expect(rm).toHaveBeenCalledWith(tempDir, { recursive: true, force: true });
            expect(rm).toHaveBeenCalledWith(zipDir, { recursive: true, force: true });
            expect(mkdir).toHaveBeenCalledWith(tempDir, { recursive: true });
            // Assert processCSVFile is called with the correct arguments
            expect(fileProcessorMock.processCSVFile).toHaveBeenCalledWith(fileMock, true);
        });
    });
});
