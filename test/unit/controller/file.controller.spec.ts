import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import { FileVariant } from '../../../src/controllers/dto/file-variant.enum';
import { FileController } from '../../../src/controllers/file.controller';
import { FileService } from '../../../src/services/file.service';

jest.mock('node:fs');
jest.mock('@nestjs/common', () => ({
    ...jest.requireActual('@nestjs/common'),
    StreamableFile: jest.fn().mockImplementation(() => ({
        pipe: jest.fn(),
    })),
}));

describe('FileService', () => {
    let testingModule: TestingModule;
    let fileController: FileController;
    const fileServiceMock: MockProxy<FileService> = mock<FileService>();

    beforeAll(async () => {
        testingModule = await Test.createTestingModule({
            controllers: [FileController],
            providers: [FileService],
        })
            .overrideProvider(FileService)
            .useValue(fileServiceMock)
            .compile();

        fileController = testingModule.get<FileController>(FileController);
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    describe('uploadMDMECRecordFile', () => {
        const mockFile = {
            originalname: 'test.csv',
            buffer: Buffer.from('test'),
            mimetype: 'text/csv',
        } as Express.Multer.File;

        it('should return a StreamableFile', async () => {
            const streamableFile = await fileController.uploadMDMECRecordFile(mockFile, {
                variant: FileVariant.MEC,
            });
            expect(streamableFile).toBeDefined();
        });

        it('should call fileService.processFile', async () => {
            await fileController.uploadMDMECRecordFile(mockFile, {
                variant: FileVariant.MEC,
            });
            expect(fileServiceMock.processFile).toHaveBeenCalled();
        });

        it('should throw 422 when file is not CSV', async () => {
            const txtFile = {
                ...mockFile,
                originalname: 'test.txt',
            } as Express.Multer.File;

            await expect(
                fileController.uploadMDMECRecordFile(txtFile, {
                    variant: FileVariant.MEC,
                }),
            ).rejects.toThrow('Only CSV files are allowed');
        });
    });
});
