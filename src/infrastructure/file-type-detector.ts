import { FileVariant } from '../controllers/dto/file-variant.enum';

/**
 * CSV File Type Detector
 * Analyzes CSV headers to determine if the file is MEC, MMC, or Image-Only
 */

interface FileTypeDetectionResult {
    detectedType: FileVariant | null;
    confidence: number; // 0-100
    matchedFields: string[];
    missingFields: string[];
    extraFields: string[];
    suggestions: string[];
}

/**
 * Key fields that uniquely identify each file type
 */
const FILE_TYPE_SIGNATURES = {
    [FileVariant.MEC]: {
        // Core fields that identify MEC files (reduced to absolute minimum)
        required: ['TitleDisplay', 'LocalizedInfo:language', 'Summary400', 'WorkType'],
        // Fields unique to MEC (strong indicators)
        unique: [
            'ContentID',
            'Summary190',
            'CompanyDisplayCredit',
            'CompanyDisplayCredit:language',
            'ArtReference',
            'Genre',
            'ReleaseYear',
            'ReleaseDate',
            'OrganizationID',
            'OriginalLanguage',
            'Cast:DisplayName',
            'Identifier:Namespace',
        ],
        // Fields that should NOT be in MEC
        forbidden: [
            'VideoTrackID',
            'AudioTrackID',
            'SubtitleTrackID',
            'PresentationID',
            'ExperienceID',
            'ALID',
            'WidthPixels',
            'HeightPixels',
        ],
    },
    [FileVariant.MMC]: {
        required: ['VideoType', 'VideoLanguage', 'VideoLocation', 'WidthPixels', 'HeightPixels'],
        unique: [
            'VideoTrackID',
            'AudioTrackID',
            'SubtitleTrackID',
            'PresentationID',
            'ExperienceID',
            'ALID',
            'PresentationIDVid',
            'PresentationIDAud',
            'PresentationIDSub',
            'PresentationIDTrackNum',
            'AspectRatio',
            'VideoHash',
        ],
        forbidden: [
            'TitleDisplay',
            'Summary190',
            'Summary400',
            'CompanyDisplayCredit',
            'Cast:DisplayName',
            'Genre',
            'OriginalLanguage',
        ],
    },
    [FileVariant.ImageOnly]: {
        required: [
            'ContentID',
            'ReleaseYear',
            'WorkType',
            'OrganizationID',
            'ArtReference',
            'ArtReference:resolution',
            'ArtReference:purpose',
        ],
        unique: ['LocalizedInfo:language', 'Identifier:Namespace', 'Identifier'],
        forbidden: ['VideoTrackID', 'AudioTrackID', 'PresentationID', 'ExperienceID', 'TitleDisplay', 'Summary400'],
    },
};

/**
 * Detect file type from CSV headers
 */
export function detectFileType(headers: string[]): FileTypeDetectionResult {
    const headerSet = new Set(headers.map(h => h.trim()));
    const scores: Record<FileVariant, number> = {
        [FileVariant.MEC]: 0,
        [FileVariant.MMC]: 0,
        [FileVariant.ImageOnly]: 0,
    };

    let bestMatch: FileVariant | null = null;
    let bestScore = 0;

    // Score each file type
    for (const [fileType, signature] of Object.entries(FILE_TYPE_SIGNATURES)) {
        let score = 0;

        // Check required fields (10 points each)
        for (const field of signature.required) {
            if (headerSet.has(field)) {
                score += 10;
            }
        }

        // Check unique fields (5 points each)
        for (const field of signature.unique) {
            if (headerSet.has(field)) {
                score += 5;
            }
        }

        // Check forbidden fields (heavy penalty: -20 points each)
        for (const field of signature.forbidden) {
            if (headerSet.has(field)) {
                score -= 20;
            }
        }

        scores[fileType as FileVariant] = score;

        if (score > bestScore) {
            bestScore = score;
            bestMatch = fileType as FileVariant;
        }
    }

    // If best score is negative or zero, couldn't determine type
    if (!bestMatch || bestScore <= 0) {
        return {
            detectedType: null,
            confidence: 0,
            matchedFields: [],
            missingFields: [],
            extraFields: [],
            suggestions: [
                'CSV headers do not match MEC, MMC, or Image-Only format',
                'Please check your CSV file structure',
            ],
        };
    }

    // Calculate confidence (0-100)
    const signature = FILE_TYPE_SIGNATURES[bestMatch];
    const requiredCount = signature.required.length;
    const matchedRequired = signature.required.filter(f => headerSet.has(f)).length;
    const confidence = Math.round((matchedRequired / requiredCount) * 100);

    // Find missing required fields
    const missingFields = signature.required.filter(f => !headerSet.has(f));

    // Find extra/unexpected fields
    const allExpectedFields = new Set([...signature.required, ...signature.unique]);
    const extraFields = headers.filter(h => !allExpectedFields.has(h.trim()));

    // Generate suggestions
    const suggestions: string[] = [];
    if (missingFields.length > 0) {
        suggestions.push(`Missing required ${bestMatch} fields: ${missingFields.join(', ')}`);
    }

    return {
        detectedType: bestMatch,
        confidence,
        matchedFields: signature.required.filter(f => headerSet.has(f)),
        missingFields,
        extraFields,
        suggestions,
    };
}

/**
 * Validate that uploaded file matches expected type
 * Throws detailed error if mismatch detected
 */
export function validateFileType(headers: string[], expectedType: FileVariant): void {
    const detection = detectFileType(headers);

    // If couldn't detect type at all
    if (!detection.detectedType) {
        throw new Error(
            `Could not determine file type from CSV headers. ${detection.suggestions.join('. ')}. ` +
                `Expected ${expectedType} file with fields like: ${FILE_TYPE_SIGNATURES[expectedType].required
                    .slice(0, 5)
                    .join(', ')}...`,
        );
    }

    // If detected type doesn't match expected
    if (detection.detectedType !== expectedType) {
        const forbiddenFieldsInData = FILE_TYPE_SIGNATURES[expectedType].forbidden.filter(f => headers.includes(f));

        throw new Error(
            `File type mismatch! You uploaded a ${detection.detectedType} file but selected ${expectedType}.\n\n` +
                `Detected: ${detection.detectedType} (${detection.confidence}% confidence)\n` +
                `Expected: ${expectedType}\n\n` +
                `Your file contains ${detection.detectedType}-specific fields: ${forbiddenFieldsInData
                    .slice(0, 5)
                    .join(', ')}${forbiddenFieldsInData.length > 5 ? '...' : ''}\n` +
                `But is missing ${expectedType}-required fields: ${detection.missingFields.slice(0, 5).join(', ')}${
                    detection.missingFields.length > 5 ? '...' : ''
                }\n\n` +
                `Please:\n` +
                `1. Select "${detection.detectedType}" as the file type, OR\n` +
                `2. Upload a ${expectedType} CSV file instead`,
        );
    }

    // If confidence is too low (missing too many required fields)
    // Lowered threshold to 50% to accommodate optional fields
    if (detection.confidence < 50) {
        throw new Error(
            `${expectedType} file validation warning: Only ${detection.confidence}% match.\n` +
                `Missing core fields: ${detection.missingFields.join(', ')}\n\n` +
                `A valid ${expectedType} file should include these core fields:\n${FILE_TYPE_SIGNATURES[
                    expectedType
                ].required.join(', ')}`,
        );
    }

    // Success - file type matches and has enough required fields
}

/**
 * Extract headers from CSV buffer
 */
export function extractCsvHeaders(buffer: Buffer): string[] {
    const content = buffer.toString('utf-8');
    const firstLine = content.split('\n')[0];
    return firstLine.split(',').map(h => h.trim().replaceAll(/(^"|"$)/g, ''));
}
