import { detectFileType, validateFileType, extractCsvHeaders } from '../src/infrastructure/file-type-detector';
import { FileVariant } from '../src/controllers/dto/file-variant.enum';

describe('File Type Detector', () => {
    describe('detectFileType', () => {
        it('should detect MEC file from headers', () => {
            const mecHeaders = [
                'ContentID',
                'LocalizedInfo:language',
                'TitleDisplay',
                'Summary190',
                'Summary400',
                'Genre',
                'ReleaseYear',
                'ReleaseDate',
                'WorkType',
                'OrganizationID',
                'CompanyDisplayCredit',
            ];

            const result = detectFileType(mecHeaders);

            expect(result.detectedType).toBe(FileVariant.MEC);
            expect(result.confidence).toBeGreaterThan(70);
        });

        it('should detect MMC file from headers', () => {
            const mmcHeaders = [
                'VideoTrackID',
                'VideoType',
                'VideoLanguage',
                'VideoLocation',
                'WidthPixels',
                'HeightPixels',
                'AudioTrackID',
                'PresentationID',
                'ExperienceID',
                'ALID',
            ];

            const result = detectFileType(mmcHeaders);

            expect(result.detectedType).toBe(FileVariant.MMC);
            expect(result.confidence).toBeGreaterThan(70);
        });

        it('should detect Image-Only file from headers', () => {
            const imageHeaders = [
                'ContentID',
                'ReleaseYear',
                'WorkType',
                'OrganizationID',
                'ArtReference',
                'ArtReference:resolution',
                'ArtReference:purpose',
                'LocalizedInfo:language',
            ];

            const result = detectFileType(imageHeaders);

            expect(result.detectedType).toBe(FileVariant.ImageOnly);
            expect(result.confidence).toBeGreaterThan(70);
        });

        it('should return null for unrecognizable headers', () => {
            const invalidHeaders = ['SomeField', 'AnotherField', 'RandomData'];

            const result = detectFileType(invalidHeaders);

            expect(result.detectedType).toBeNull();
            expect(result.confidence).toBe(0);
            expect(result.suggestions.length).toBeGreaterThan(0);
        });

        it('should identify MEC file even with optional fields missing', () => {
            const minimalMecHeaders = [
                'ContentID',
                'LocalizedInfo:language',
                'TitleDisplay',
                'Summary400',
                'Genre',
                'ReleaseYear',
                'ReleaseDate',
                'WorkType',
                'OrganizationID',
                'OriginalLanguage',
            ];

            const result = detectFileType(minimalMecHeaders);

            expect(result.detectedType).toBe(FileVariant.MEC);
            expect(result.confidence).toBeGreaterThanOrEqual(70);
        });
    });

    describe('validateFileType', () => {
        it('should pass when MEC file uploaded as MEC', () => {
            const mecHeaders = [
                'ContentID',
                'LocalizedInfo:language',
                'TitleDisplay',
                'Summary190',
                'Summary400',
                'Genre',
                'ReleaseYear',
                'ReleaseDate',
                'WorkType',
                'OrganizationID',
            ];

            expect(() => {
                validateFileType(mecHeaders, FileVariant.MEC);
            }).not.toThrow();
        });

        it('should pass when MMC file uploaded as MMC', () => {
            const mmcHeaders = [
                'VideoTrackID',
                'VideoType',
                'VideoLanguage',
                'VideoLocation',
                'WidthPixels',
                'HeightPixels',
                'PresentationID',
                'ExperienceID',
                'ALID',
            ];

            expect(() => {
                validateFileType(mmcHeaders, FileVariant.MMC);
            }).not.toThrow();
        });

        it('should throw error when MMC file uploaded as MEC', () => {
            const mmcHeaders = [
                'VideoTrackID',
                'VideoType',
                'VideoLanguage',
                'VideoLocation',
                'WidthPixels',
                'HeightPixels',
                'PresentationID',
                'ExperienceID',
                'ALID',
            ];

            expect(() => {
                validateFileType(mmcHeaders, FileVariant.MEC);
            }).toThrow(/File type mismatch/);
            expect(() => {
                validateFileType(mmcHeaders, FileVariant.MEC);
            }).toThrow(/uploaded a MMC file but selected MEC/);
        });

        it('should throw error when MEC file uploaded as MMC', () => {
            const mecHeaders = [
                'ContentID',
                'LocalizedInfo:language',
                'TitleDisplay',
                'Summary190',
                'Summary400',
                'Genre',
                'ReleaseYear',
                'ReleaseDate',
                'WorkType',
                'OrganizationID',
            ];

            expect(() => {
                validateFileType(mecHeaders, FileVariant.MMC);
            }).toThrow(/File type mismatch/);
            expect(() => {
                validateFileType(mecHeaders, FileVariant.MMC);
            }).toThrow(/uploaded a MEC file but selected MMC/);
        });

        it('should throw error with helpful message for missing required fields', () => {
            const incompleteMecHeaders = [
                'ContentID',
                'TitleDisplay',
                // Missing many required fields
            ];

            expect(() => {
                validateFileType(incompleteMecHeaders, FileVariant.MEC);
            }).toThrow(/validation warning/);
            expect(() => {
                validateFileType(incompleteMecHeaders, FileVariant.MEC);
            }).toThrow(/Missing core fields/);
        });

        it('should provide suggestions on which file type to select', () => {
            const mmcHeaders = [
                'VideoTrackID',
                'VideoType',
                'VideoLanguage',
                'VideoLocation',
                'WidthPixels',
                'HeightPixels',
                'PresentationID',
                'ExperienceID',
                'ALID',
            ];

            try {
                validateFileType(mmcHeaders, FileVariant.MEC);
                fail('Should have thrown an error');
            } catch (error) {
                expect(error.message).toContain('Select "MMC" as the file type');
            }
        });
    });

    describe('extractCsvHeaders', () => {
        it('should extract headers from CSV buffer', () => {
            const csvContent = 'ContentID,TitleDisplay,Genre\nvalue1,value2,value3\n';
            const buffer = Buffer.from(csvContent, 'utf-8');

            const headers = extractCsvHeaders(buffer);

            expect(headers).toEqual(['ContentID', 'TitleDisplay', 'Genre']);
        });

        it('should handle quoted headers', () => {
            const csvContent = '"ContentID","Title Display","Genre"\nvalue1,value2,value3\n';
            const buffer = Buffer.from(csvContent, 'utf-8');

            const headers = extractCsvHeaders(buffer);

            expect(headers).toEqual(['ContentID', 'Title Display', 'Genre']);
        });

        it('should trim whitespace from headers', () => {
            const csvContent = ' ContentID , TitleDisplay , Genre \nvalue1,value2,value3\n';
            const buffer = Buffer.from(csvContent, 'utf-8');

            const headers = extractCsvHeaders(buffer);

            expect(headers).toEqual(['ContentID', 'TitleDisplay', 'Genre']);
        });
    });

    describe('Error Messages', () => {
        it('should include field names in error for MEC/MMC confusion', () => {
            const mmcHeaders = [
                'VideoTrackID',
                'VideoType',
                'AudioTrackID',
                'PresentationID',
                'ExperienceID',
                'ALID',
                'WidthPixels',
                'HeightPixels',
                'VideoLanguage',
            ];

            try {
                validateFileType(mmcHeaders, FileVariant.MEC);
                fail('Should throw error');
            } catch (error) {
                // Should mention MMC-specific fields found
                expect(error.message).toContain('VideoTrackID');
                expect(error.message).toContain('PresentationID');
                // Should indicate it's an MMC file
                expect(error.message).toContain('MMC');
                expect(error.message).toContain('File type mismatch');
            }
        });

        it('should suggest correct action for wrong file type', () => {
            const mecHeaders = [
                'ContentID',
                'TitleDisplay',
                'Summary400',
                'Genre',
                'ReleaseYear',
                'ReleaseDate',
                'WorkType',
                'OrganizationID',
                'LocalizedInfo:language',
            ];

            try {
                validateFileType(mecHeaders, FileVariant.MMC);
                fail('Should throw error');
            } catch (error) {
                expect(error.message).toContain('Select "MEC" as the file type');
                expect(error.message).toContain('Upload a MMC CSV file instead');
            }
        });
    });
});
