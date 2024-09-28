import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { FileVariant } from '../../src/controllers/dto/file-variant.enum';
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
        const path = '/upload';
        const txtFile = './test/e2e/test-files/test.txt';
        const csvFile = './test/e2e/test-files/test.csv';

        it.each([
            ['should return 422 when file is not csv - mec', FileVariant.MEC],
            ['should return 422 when file is not csv - mmc', FileVariant.MMC],
            ['should return 422 when file is not csv - image-only', FileVariant.ImageOnly],
        ])('%s', async (_, variant) => {
            await request(app.getHttpServer()).post(path).attach('file', txtFile).field('variant', variant).expect(422);
        });

        it.each([
            ['should return 200 when file is valid - mec', FileVariant.MEC],
            ['should return 200 when file is valid - mmc', FileVariant.MMC],
            ['should return 200 when file is valid - image-only', FileVariant.ImageOnly],
        ])('%s', async (_, variant) => {
            await request(app.getHttpServer()).post(path).attach('file', csvFile).field('variant', variant).expect(200);
        });

        it.each([
            ['should return result.zip as download - mec', FileVariant.MEC],
            ['should return result.zip as download - mmc', FileVariant.MMC],
            ['should return result.zip as download - image-only', FileVariant.ImageOnly],
        ])('%s', async (_, variant) => {
            await request(app.getHttpServer())
                .post(path)
                .attach('file', csvFile)
                .field('variant', variant)
                .expect(200)
                .expect('Content-Disposition', 'attachment; filename="result.zip"');
        });
    });
});
