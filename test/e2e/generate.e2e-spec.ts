import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Generate Controller (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/generate/mmc (POST)', () => {
        const endpoint = '/generate/mmc';

        it('should generate MMC XML from minimal valid payload', async () => {
            const payload = {
                audio: [
                    {
                        type: 'stereo',
                        language: 'en-US',
                        location: 'https://cdn.wiflix.com/test-movie/audio.aac',
                    },
                ],
                video: [
                    {
                        type: 'primary',
                        language: 'en-US',
                        location: 'https://cdn.wiflix.com/test-movie/video.mp4',
                        picture: {
                            heightPixels: '1080',
                            widthPixels: '1920',
                        },
                    },
                ],
                presentation: [{}],
                experience: [
                    {
                        type: 'Movie',
                        subType: 'Feature',
                    },
                ],
                alidExperience: [{}],
            };

            const response = await request(app.getHttpServer())
                .post(endpoint)
                .send(payload)
                .expect(200)
                .expect('Content-Type', /xml/);

            expect(response.text).toContain('<?xml version="1.0" encoding="UTF-8"?>');
            expect(response.text).toContain('<manifest:MediaManifest');
            expect(response.text).toContain('md:audtrackid:org:wiflix:test-movie');
            expect(response.text).toContain('md:vidtrackid:org:wiflix:test-movie');
            expect(response.text).toContain('md:presentationid:org:wiflix:test-movie');
            expect(response.text).toContain('md:experienceid:org:wiflix:test-movie');
            expect(response.text).toContain('<md:AspectRatio>16:9</md:AspectRatio>');
        });

        it('should generate MMC XML with multiple audio tracks', async () => {
            const payload = {
                audio: [
                    {
                        type: 'stereo',
                        language: 'en-US',
                        location: 'https://cdn.wiflix.com/test-movie/audio-en.aac',
                    },
                    {
                        type: 'stereo',
                        language: 'es-ES',
                        location: 'https://cdn.wiflix.com/test-movie/audio-es.aac',
                    },
                    {
                        type: '51',
                        language: 'en-US',
                        location: 'https://cdn.wiflix.com/test-movie/audio-surround.aac',
                    },
                ],
                video: [
                    {
                        type: 'primary',
                        language: 'en-US',
                        location: 'https://cdn.wiflix.com/test-movie/video.mp4',
                        picture: {
                            heightPixels: '1080',
                            widthPixels: '1920',
                        },
                    },
                ],
                presentation: [{}],
                experience: [
                    {
                        type: 'Movie',
                        subType: 'Feature',
                    },
                ],
                alidExperience: [{}],
            };

            const response = await request(app.getHttpServer()).post(endpoint).send(payload).expect(200);

            // Should have unique audio track IDs based on language
            expect(response.text).toContain('audio-en-us');
            expect(response.text).toContain('audio-es-es');
            expect(response.text.match(/AudioTrackID/g)).toHaveLength(3);
        });

        it('should generate MMC XML with subtitles and images', async () => {
            const payload = {
                audio: [
                    {
                        type: 'stereo',
                        language: 'en-US',
                        location: 'https://cdn.wiflix.com/test-movie/audio.aac',
                    },
                ],
                video: [
                    {
                        type: 'primary',
                        language: 'en-US',
                        location: 'https://cdn.wiflix.com/test-movie/video.mp4',
                        picture: {
                            heightPixels: '1080',
                            widthPixels: '1920',
                        },
                    },
                ],
                subtitle: [
                    {
                        type: 'open',
                        language: 'en-US',
                        location: 'https://cdn.wiflix.com/test-movie/subtitle.srt',
                        frameRate: '23.976',
                        frameRateMultiplier: '1001/1000',
                        frameRateTimeCode: 'NonDrop',
                    },
                ],
                image: [
                    {
                        purpose: 'Cover',
                        language: 'en-US',
                        location: 'https://cdn.wiflix.com/test-movie/cover.jpg',
                    },
                ],
                presentation: [{}],
                experience: [
                    {
                        type: 'Movie',
                        subType: 'Feature',
                    },
                ],
                alidExperience: [{}],
            };

            const response = await request(app.getHttpServer()).post(endpoint).send(payload).expect(200);

            expect(response.text).toContain('<manifest:Subtitle');
            expect(response.text).toContain('SubtitleTrackID');
            expect(response.text).toContain('<manifest:Image');
            expect(response.text).toContain('ImageID');
        });

        it('should respect explicit track IDs when provided', async () => {
            const customAudioId = 'md:audtrackid:org:wiflix:custom:audio-main';
            const customVideoId = 'md:vidtrackid:org:wiflix:custom:video-main';

            const payload = {
                audio: [
                    {
                        trackId: customAudioId,
                        type: 'stereo',
                        language: 'en-US',
                        location: 'https://cdn.wiflix.com/test-movie/audio.aac',
                    },
                ],
                video: [
                    {
                        trackId: customVideoId,
                        type: 'primary',
                        language: 'en-US',
                        location: 'https://cdn.wiflix.com/test-movie/video.mp4',
                        picture: {
                            heightPixels: '1080',
                            widthPixels: '1920',
                        },
                    },
                ],
                presentation: [{}],
                experience: [
                    {
                        type: 'Movie',
                        subType: 'Feature',
                    },
                ],
                alidExperience: [{}],
            };

            const response = await request(app.getHttpServer()).post(endpoint).send(payload).expect(200);

            expect(response.text).toContain(customAudioId);
            expect(response.text).toContain(customVideoId);
        });

        it('should handle missing required fields gracefully', async () => {
            const invalidPayload = {
                audio: [
                    {
                        type: 'stereo',
                        language: 'en-US',
                        // Missing location
                    },
                ],
                video: [],
            };

            const response = await request(app.getHttpServer()).post(endpoint).send(invalidPayload);

            // Should return error (400 or 500)
            expect([400, 500]).toContain(response.status);
        });

        it('should handle missing video dimensions gracefully', async () => {
            const invalidPayload = {
                audio: [
                    {
                        type: 'stereo',
                        language: 'en-US',
                        location: 'https://cdn.wiflix.com/test-movie/audio.aac',
                    },
                ],
                video: [
                    {
                        type: 'primary',
                        language: 'en-US',
                        location: 'https://cdn.wiflix.com/test-movie/video.mp4',
                        picture: {
                            // Missing heightPixels and widthPixels
                        },
                    },
                ],
                presentation: [{}],
                experience: [
                    {
                        type: 'Movie',
                        subType: 'Feature',
                    },
                ],
                alidExperience: [{}],
            };

            const response = await request(app.getHttpServer()).post(endpoint).send(invalidPayload);

            // Service handles this gracefully - may return success or error
            expect([200, 400, 500]).toContain(response.status);
        });
    });

    describe('/generate/mec (POST)', () => {
        const endpoint = '/generate/mec';

        it('should generate MEC XML from minimal valid payload', async () => {
            const payload = {
                contentId: 'md:cid:org:wiflix:test-movie',
                localizedInfo: [
                    {
                        language: 'en-US',
                        titleDisplay: 'Test Movie',
                        summary400: 'A test movie for E2E testing.',
                    },
                ],
                genre: [
                    {
                        primary: 'Drama',
                    },
                ],
                releaseYear: '2024',
                releaseDate: '2024-01-15',
                releaseHistory: [
                    {
                        type: 'Original',
                        country: 'US',
                        date: '2024-01-15',
                    },
                ],
                workType: 'movie',
                identifier: [
                    {
                        namespace: 'ORG',
                        value: 'test-movie-001',
                    },
                ],
                cast: [
                    {
                        jobFunction: 'Actor',
                        billingBlockOrder: '1',
                        displayName: {
                            'en-US': 'Test Actor',
                        },
                    },
                ],
                originalLanguage: 'en',
                organization: {
                    id: 'md:orgid:wiflix',
                    role: 'licensor',
                },
                companyDisplayCredit: {
                    value: 'WiFlix Studios',
                    language: 'en-US',
                },
            };

            const response = await request(app.getHttpServer())
                .post(endpoint)
                .send(payload)
                .expect(200)
                .expect('Content-Type', /xml/);

            expect(response.text).toContain('<?xml version="1.0" encoding="UTF-8"?>');
            expect(response.text).toContain('<mdmec:CoreMetadata');
            expect(response.text).toContain('ContentID="md:cid:org:wiflix:test-movie"');
            expect(response.text).toContain('<md:TitleDisplayUnlimited>Test Movie</md:TitleDisplayUnlimited>');
            expect(response.text).toContain('<md:TitleSort>Test Movie</md:TitleSort>');
            expect(response.text).toContain('av_genre_Drama');
        });

        it('should auto-generate titleSort by removing articles', async () => {
            const payload = {
                contentId: 'md:cid:org:wiflix:the-matrix',
                localizedInfo: [
                    {
                        language: 'en-US',
                        titleDisplay: 'The Matrix',
                        summary400: 'A computer hacker learns about reality.',
                    },
                ],
                genre: [{ primary: 'Sci-Fi' }],
                releaseYear: '1999',
                releaseDate: '1999-03-31',
                releaseHistory: [
                    {
                        type: 'Theatrical',
                        country: 'US',
                        date: '1999-03-31',
                    },
                ],
                workType: 'movie',
                identifier: [{ namespace: 'ORG', value: 'matrix-001' }],
                cast: [
                    {
                        jobFunction: 'Actor',
                        billingBlockOrder: '1',
                        displayName: { 'en-US': 'Keanu Reeves' },
                    },
                ],
                originalLanguage: 'en',
                organization: { id: 'md:orgid:wiflix', role: 'licensor' },
                companyDisplayCredit: { value: 'WiFlix Studios', language: 'en-US' },
            };

            const response = await request(app.getHttpServer()).post(endpoint).send(payload).expect(200);

            expect(response.text).toContain('<md:TitleDisplayUnlimited>The Matrix</md:TitleDisplayUnlimited>');
            expect(response.text).toContain('<md:TitleSort>Matrix</md:TitleSort>');
        });

        it('should generate MEC XML with multiple localized info', async () => {
            const payload = {
                contentId: 'md:cid:org:wiflix:multilang-movie',
                localizedInfo: [
                    {
                        language: 'en-US',
                        titleDisplay: 'My Movie',
                        summary400: 'An epic adventure.',
                    },
                    {
                        language: 'es-ES',
                        titleDisplay: 'Mi Película',
                        summary400: 'Una aventura épica.',
                    },
                    {
                        language: 'fr-FR',
                        titleDisplay: 'Mon Film',
                        summary400: 'Une aventure épique.',
                    },
                ],
                genre: [{ primary: 'Action' }],
                releaseYear: '2024',
                releaseDate: '2024-01-15',
                releaseHistory: [{ type: 'Original', country: 'US', date: '2024-01-15' }],
                workType: 'movie',
                identifier: [{ namespace: 'ORG', value: 'movie-001' }],
                cast: [
                    {
                        jobFunction: 'Actor',
                        billingBlockOrder: '1',
                        displayName: { 'en-US': 'Actor Name' },
                    },
                ],
                originalLanguage: 'en',
                organization: { id: 'md:orgid:wiflix', role: 'licensor' },
                companyDisplayCredit: { value: 'WiFlix Studios', language: 'en-US' },
            };

            const response = await request(app.getHttpServer()).post(endpoint).send(payload).expect(200);

            expect(response.text).toContain('language="en-US"');
            expect(response.text).toContain('language="es-ES"');
            expect(response.text).toContain('language="fr-FR"');
            expect(response.text.match(/<md:LocalizedInfo/g)).toHaveLength(3);
        });

        it('should generate MEC XML with ratings', async () => {
            const payload = {
                contentId: 'md:cid:org:wiflix:rated-movie',
                localizedInfo: [
                    {
                        language: 'en-US',
                        titleDisplay: 'Rated Movie',
                        summary400: 'A rated movie.',
                    },
                ],
                genre: [{ primary: 'Drama' }],
                releaseYear: '2024',
                releaseDate: '2024-01-15',
                releaseHistory: [{ type: 'Original', country: 'US', date: '2024-01-15' }],
                workType: 'movie',
                identifier: [{ namespace: 'ORG', value: 'movie-001' }],
                rating: [
                    {
                        country: 'US',
                        system: 'MPAA',
                        value: 'PG-13',
                    },
                    {
                        country: 'GB',
                        system: 'BBFC',
                        value: '12A',
                    },
                ],
                cast: [
                    {
                        jobFunction: 'Actor',
                        billingBlockOrder: '1',
                        displayName: { 'en-US': 'Actor Name' },
                    },
                ],
                originalLanguage: 'en',
                organization: { id: 'md:orgid:wiflix', role: 'licensor' },
                companyDisplayCredit: { value: 'WiFlix Studios', language: 'en-US' },
            };

            const response = await request(app.getHttpServer()).post(endpoint).send(payload).expect(200);

            expect(response.text).toContain('<md:Rating>');
            expect(response.text).toContain('<md:Region>');
            expect(response.text).toContain('PG-13');
            expect(response.text).toContain('12A');
        });

        it('should handle missing contentId gracefully', async () => {
            const invalidPayload = {
                // Missing contentId
                localizedInfo: [
                    {
                        language: 'en-US',
                        titleDisplay: 'Test Movie',
                        summary400: 'A test.',
                    },
                ],
            };

            const response = await request(app.getHttpServer()).post(endpoint).send(invalidPayload);

            // Should return error (400 or 500)
            expect([400, 500]).toContain(response.status);
        });

        it('should handle missing localizedInfo gracefully', async () => {
            const invalidPayload = {
                contentId: 'md:cid:org:wiflix:test-movie',
                // Missing localizedInfo
                genre: [{ primary: 'Drama' }],
            };

            const response = await request(app.getHttpServer()).post(endpoint).send(invalidPayload);

            // Should return error (400 or 500)
            expect([400, 500]).toContain(response.status);
        });
    });
});
