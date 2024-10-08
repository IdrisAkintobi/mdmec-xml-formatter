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
        it('should return a StreamableFile', async () => {
            const streamableFile = await fileController.uploadMDMECRecordFile(null, {
                variant: FileVariant.MEC,
            });
            expect(streamableFile).toBeDefined();
        });

        it('should call fileService.processFile', async () => {
            await fileController.uploadMDMECRecordFile(null, {
                variant: FileVariant.MEC,
            });
            expect(fileServiceMock.processFile).toHaveBeenCalled();
        });
    });
});
