import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import { mkdir, rm } from 'node:fs/promises';
import { tempDir, zipDir } from '../../../src/app.module';
import { FileVariant } from '../../../src/controllers/dto/file-variant.enum';
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
        it('should process file with MEC variant', async () => {
            // Mock the processCSVFile method of FileProcessor
            fileProcessorMock.processCSVFile.mockResolvedValue(undefined);

            await fileService.processFile(fileMock, FileVariant.MEC);

            // Assert previous result and temp directory are deleted
            expect(rm).toHaveBeenCalledWith(tempDir, { recursive: true, force: true });
            expect(rm).toHaveBeenCalledWith(zipDir, { recursive: true, force: true });
            expect(mkdir).toHaveBeenCalledWith(tempDir, { recursive: true });
            // Assert processCSVFile is called with the correct arguments
            expect(fileProcessorMock.processCSVFile).toHaveBeenCalledWith(fileMock, FileVariant.MEC);
        });

        it('should process file with isImageOnly variant', async () => {
            // Mock the processCSVFile method of FileProcessor
            fileProcessorMock.processCSVFile.mockResolvedValue(undefined);

            await fileService.processFile(fileMock, FileVariant.ImageOnly);

            // Assert previous result and temp directory are deleted
            expect(rm).toHaveBeenCalledWith(tempDir, { recursive: true, force: true });
            expect(rm).toHaveBeenCalledWith(zipDir, { recursive: true, force: true });
            expect(mkdir).toHaveBeenCalledWith(tempDir, { recursive: true });
            // Assert processCSVFile is called with the correct arguments
            expect(fileProcessorMock.processCSVFile).toHaveBeenCalledWith(fileMock, FileVariant.ImageOnly);
        });

        it('should process file with MMC variant', async () => {
            // Mock the processCSVFile method of FileProcessor
            fileProcessorMock.processCSVFile.mockResolvedValue(undefined);

            await fileService.processFile(fileMock, FileVariant.MMC);

            // Assert previous result and temp directory are deleted
            expect(rm).toHaveBeenCalledWith(tempDir, { recursive: true, force: true });
            expect(rm).toHaveBeenCalledWith(zipDir, { recursive: true, force: true });
            expect(mkdir).toHaveBeenCalledWith(tempDir, { recursive: true });
            // Assert processCSVFile is called with the correct arguments
            expect(fileProcessorMock.processCSVFile).toHaveBeenCalledWith(fileMock, FileVariant.MMC);
        });
    });
});
