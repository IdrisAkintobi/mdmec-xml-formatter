import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { FileService } from '../../src/services/file.service';

jest.mock('node:fs');
jest.mock('@nestjs/common', () => ({
    ...jest.requireActual('@nestjs/common'),
    StreamableFile: jest.fn().mockImplementation(() => ({
        pipe: jest.fn(),
    })),
}));

describe('AppController (e2e)', () => {
    let app: INestApplication;
    const fileServiceMock: MockProxy<FileService> = mock<FileService>();

    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(FileService)
            .useValue(fileServiceMock)
            .compile();

        app = testingModule.createNestApplication();
        await app.init();
    });

    describe('/upload (POST)', () => {
        const mdmecPath = '/upload/mdmec';
        const ImageOnlyPath = '/upload/image-only';
        const txtFile = './test/e2e/test-files/test.txt';
        const csvFile = './test/e2e/test-files/test.csv';

        it.each([
            ['should return 422 when file is not csv - mdmec', mdmecPath],
            ['should return 422 when file is not csv - image-only', ImageOnlyPath],
        ])('%s', async (_, path) => {
            await request(app.getHttpServer()).post(path).attach('file', txtFile).expect(422);
        });

        it.each([
            ['should return 200 when file is valid - mdmec', mdmecPath],
            ['should return 200 when file is valid - image-only', ImageOnlyPath],
        ])('%s', async (_, path) => {
            await request(app.getHttpServer()).post(path).attach('file', csvFile).expect(200);
        });

        it.each([
            ['should return result.zip as download - mdmec', mdmecPath],
            ['should return result.zip as download - image-only', ImageOnlyPath],
        ])('%s', async (_, path) => {
            await request(app.getHttpServer())
                .post(path)
                .attach('file', csvFile)
                .expect(200)
                .expect('Content-Disposition', 'attachment; filename="result.zip"');
        });
    });
});
