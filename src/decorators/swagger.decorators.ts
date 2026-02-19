import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenerateMECDto } from '../dto/generate/mec.dto';
import { GenerateMMCDto } from '../dto/generate/mmc.dto';

/**
 * Swagger examples for MMC endpoint
 */
const MMC_EXAMPLES = {
    minimal: {
        summary: 'Minimal MMC (IDs auto-generated)',
        description: 'Simplest MMC payload with just one audio and video track',
        value: {
            audio: [
                {
                    type: 'stereo',
                    language: 'en-US',
                    location: 'https://cdn.wiflix.com/chioma-my-love/audio.aac',
                },
            ],
            video: [
                {
                    type: 'primary',
                    language: 'en-US',
                    location: 'https://cdn.wiflix.com/chioma-my-love/video.mp4',
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
        },
    },
    multipleAudio: {
        summary: 'Multiple Audio Languages',
        description: 'MMC with multiple audio tracks for different languages',
        value: {
            audio: [
                {
                    type: 'stereo',
                    language: 'en-US',
                    location: 'https://cdn.wiflix.com/my-movie/audio-en.aac',
                },
                {
                    type: 'stereo',
                    language: 'es-ES',
                    location: 'https://cdn.wiflix.com/my-movie/audio-es.aac',
                },
                {
                    type: '51',
                    language: 'en-US',
                    location: 'https://cdn.wiflix.com/my-movie/audio-surround.aac',
                },
            ],
            video: [
                {
                    type: 'primary',
                    language: 'en-US',
                    location: 'https://cdn.wiflix.com/my-movie/video.mp4',
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
        },
    },
    withSubtitles: {
        summary: 'With Subtitles and Images',
        description: 'Complete MMC with subtitles and image assets',
        value: {
            audio: [
                {
                    type: 'stereo',
                    language: 'en-US',
                    location: 'https://cdn.wiflix.com/my-movie/audio.aac',
                },
            ],
            video: [
                {
                    type: 'primary',
                    language: 'en-US',
                    location: 'https://cdn.wiflix.com/my-movie/video.mp4',
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
                    location: 'https://cdn.wiflix.com/my-movie/subtitle-en.srt',
                    frameRate: '23.976',
                    frameRateMultiplier: '1001/1000',
                    frameRateTimeCode: 'NonDrop',
                },
                {
                    type: 'open',
                    language: 'es-ES',
                    location: 'https://cdn.wiflix.com/my-movie/subtitle-es.srt',
                    frameRate: '23.976',
                    frameRateMultiplier: '1001/1000',
                    frameRateTimeCode: 'NonDrop',
                },
            ],
            image: [
                {
                    purpose: 'Cover',
                    language: 'en-US',
                    location: 'https://cdn.wiflix.com/my-movie/cover.jpg',
                },
                {
                    purpose: 'Hero',
                    language: 'en-US',
                    location: 'https://cdn.wiflix.com/my-movie/hero.jpg',
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
        },
    },
    withExplicitIds: {
        summary: 'With Explicit IDs',
        description: 'MMC with manually specified track IDs',
        value: {
            audio: [
                {
                    trackId: 'md:audtrackid:org:wiflix:my-movie:audio-main',
                    type: 'stereo',
                    language: 'en-US',
                    location: 'https://cdn.wiflix.com/my-movie/audio.aac',
                    hash: 'a1b2c3d4e5f6789',
                },
            ],
            video: [
                {
                    trackId: 'md:vidtrackid:org:wiflix:my-movie:video-main',
                    type: 'primary',
                    language: 'en-US',
                    location: 'https://cdn.wiflix.com/my-movie/video.mp4',
                    hash: 'v1i2d3e4o5h6a7s8h',
                    picture: {
                        heightPixels: '1080',
                        widthPixels: '1920',
                        aspectRatio: '16:9',
                    },
                },
            ],
            presentation: [
                {
                    id: 'md:presentationid:org:wiflix:my-movie:presentation-main',
                    trackNum: '0',
                    videoId: 'md:vidtrackid:org:wiflix:my-movie:video-main',
                    audioId: 'md:audtrackid:org:wiflix:my-movie:audio-main',
                },
            ],
            experience: [
                {
                    id: 'md:experienceid:org:wiflix:my-movie:experience-main',
                    type: 'Movie',
                    subType: 'Feature',
                },
            ],
            alidExperience: [
                {
                    alid: 'md:ALID:org:wiflix:my-movie',
                    experienceId: 'md:experienceid:org:wiflix:my-movie:experience-main',
                },
            ],
        },
    },
};

/**
 * Swagger examples for MEC endpoint
 */
const MEC_EXAMPLES = {
    minimal: {
        summary: 'Minimal MEC',
        description: 'Simplest MEC payload with required fields only',
        value: {
            contentId: 'md:cid:org:wiflix:chioma-my-love',
            localizedInfo: [
                {
                    language: 'en-US',
                    titleDisplay: 'Chioma My Love',
                    summary400: 'A beautiful romantic story set in Lagos about love, family, and tradition.',
                },
            ],
            genre: [
                {
                    primary: 'Romance',
                },
            ],
            releaseYear: '2024',
            releaseDate: '2024-01-15',
            releaseHistory: [
                {
                    type: 'Original',
                    country: 'NG',
                    date: '2024-01-15',
                },
            ],
            workType: 'movie',
            identifier: [
                {
                    namespace: 'ORG',
                    value: 'wiflix-chioma-001',
                },
            ],
            cast: [
                {
                    jobFunction: 'Actor',
                    billingBlockOrder: '1',
                    displayName: {
                        'en-US': 'John Doe',
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
        },
    },
    multipleLanguages: {
        summary: 'Multiple Languages',
        description: 'MEC with localized info in multiple languages',
        value: {
            contentId: 'md:cid:org:wiflix:my-movie',
            localizedInfo: [
                {
                    language: 'en-US',
                    titleDisplay: 'My Epic Movie',
                    titleSort: 'Epic Movie',
                    summary190: 'An action-packed adventure through time and space.',
                    summary400:
                        'An action-packed adventure through time and space. Join our heroes as they navigate parallel universes and battle cosmic forces.',
                },
                {
                    language: 'es-ES',
                    titleDisplay: 'Mi Película Épica',
                    summary400: 'Una aventura llena de acción a través del tiempo y el espacio.',
                },
                {
                    language: 'fr-FR',
                    titleDisplay: 'Mon Film Épique',
                    summary400: "Une aventure pleine d'action à travers le temps et l'espace.",
                },
            ],
            genre: [
                {
                    primary: 'Action',
                    subGenre: ['Adventure', 'Sci-Fi'],
                },
            ],
            releaseYear: '2024',
            releaseDate: '2024-03-15',
            releaseHistory: [
                {
                    type: 'Theatrical',
                    country: 'US',
                    date: '2024-03-15',
                },
            ],
            workType: 'movie',
            identifier: [
                {
                    namespace: 'ORG',
                    value: 'wiflix-epic-001',
                },
            ],
            cast: [
                {
                    jobFunction: 'Actor',
                    billingBlockOrder: '1',
                    displayName: {
                        'en-US': 'Jane Smith',
                        'es-ES': 'Jane Smith',
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
        },
    },
    withRatings: {
        summary: 'With Ratings and Cast',
        description: 'Complete MEC with ratings and detailed cast information',
        value: {
            contentId: 'md:cid:org:wiflix:my-movie',
            localizedInfo: [
                {
                    language: 'en-US',
                    titleDisplay: 'My Movie',
                    summary400: 'A compelling drama about family and redemption.',
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
                    value: 'wiflix-movie-001',
                },
                {
                    namespace: 'IMDB',
                    value: 'tt1234567',
                },
            ],
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
                    displayName: {
                        'en-US': 'Jane Smith',
                    },
                },
                {
                    jobFunction: 'Actor',
                    billingBlockOrder: '2',
                    displayName: {
                        'en-US': 'John Doe',
                    },
                },
                {
                    jobFunction: 'Director',
                    billingBlockOrder: '3',
                    displayName: {
                        'en-US': 'Sarah Johnson',
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
        },
    },
    episodic: {
        summary: 'Episodic Content (TV Show)',
        description: 'MEC for a TV show episode',
        value: {
            contentId: 'md:cid:org:wiflix:my-series:s01:e03',
            localizedInfo: [
                {
                    language: 'en-US',
                    titleDisplay: 'The Big Reveal',
                    summary400: 'Episode 3: Secrets are revealed as the team faces their biggest challenge yet.',
                },
            ],
            genre: [
                {
                    primary: 'Drama',
                    subGenre: ['Mystery'],
                },
            ],
            releaseYear: '2024',
            releaseDate: '2024-01-22',
            releaseHistory: [
                {
                    type: 'Original',
                    country: 'US',
                    date: '2024-01-22',
                },
            ],
            workType: 'episode',
            identifier: [
                {
                    namespace: 'ORG',
                    value: 'wiflix-series-s01e03',
                },
            ],
            cast: [
                {
                    jobFunction: 'Actor',
                    billingBlockOrder: '1',
                    displayName: {
                        'en-US': 'Lead Actor',
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
            category: {
                type: 'Episode',
                sequenceNumber: '3',
                parentContentId: 'md:cid:org:wiflix:my-series:s01',
            },
        },
    },
};

/**
 * Decorator for MMC generation endpoint
 */
export function ApiGenerateMMC() {
    return applyDecorators(
        ApiTags('XML Generation (JSON API)'),
        ApiOperation({
            summary: 'Generate MMC XML from JSON',
            description: `
Generate Media Manifest Core (MMC) XML file from JSON payload.

**What is MMC?**
MMC contains technical specifications about your media files (video/audio tracks, subtitles, presentations) for Amazon Prime Video.

**Auto-Generated Fields (if not provided):**
- \`trackId\`: For audio, video, subtitle, and image tracks
- \`hash\`: MD5 hashes are optional
- \`aspectRatio\`: Auto-calculated from video dimensions
- \`presentationId\`, \`experienceId\`, \`alid\`: IDs auto-generated from organization + video location
- \`trackNum\`: Defaults to "0"
- \`videoId\`, \`audioId\`, \`subtitleId\`: References auto-generated

**ID Auto-Generation:**
IDs are extracted from the first path segment in your video URL.
Example: \`https://cdn.wiflix.com/chioma-my-love/video.mp4\` → slug: \`chioma-my-love\`
Generated IDs: \`md:vidtrackid:org:wiflix:chioma-my-love:video\`

**Multiple Tracks:**
When you have multiple audio or subtitle tracks, IDs are made unique using language codes:
- \`md:audtrackid:org:wiflix:my-movie:audio-en-us\`
- \`md:audtrackid:org:wiflix:my-movie:audio-es-es\`
      `,
        }),
        ApiBody({
            type: GenerateMMCDto,
            description: 'MMC data for XML generation',
            examples: MMC_EXAMPLES,
        }),
        ApiResponse({
            status: 200,
            description: 'MMC XML file generated successfully',
            content: {
                'application/xml': {
                    schema: {
                        type: 'string',
                        example:
                            '<?xml version="1.0" encoding="UTF-8"?><manifest:MediaManifest>...</manifest:MediaManifest>',
                    },
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: 'Invalid request payload',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number', example: 400 },
                            message: {
                                type: 'array',
                                items: { type: 'string' },
                                example: ['video.0.type is required', 'video.0.location must be a URL'],
                            },
                            error: { type: 'string', example: 'Bad Request' },
                        },
                    },
                },
            },
        }),
    );
}

/**
 * Decorator for MEC generation endpoint
 */
export function ApiGenerateMEC() {
    return applyDecorators(
        ApiTags('XML Generation (JSON API)'),
        ApiOperation({
            summary: 'Generate MEC XML from JSON',
            description: `
Generate Media Entertainment Core (MEC) XML file from JSON payload.

**What is MEC?**
MEC contains metadata about your content (title, cast, genres, ratings, etc.) for Amazon Prime Video.

**Auto-Generated Fields:**
- \`titleSort\`: Auto-generated from titleDisplay by removing articles (The, A, An)
  - Example: "The Matrix" → "Matrix", "A Beautiful Mind" → "Beautiful Mind"

**Content ID Format:**
Must follow MovieLabs ID format: \`md:cid:org:{organization}:{content-slug}\`
Example: \`md:cid:org:wiflix:chioma-my-love\`

**Localized Info:**
Provide at least one localized info entry. You can add multiple languages:
- English (en-US), Spanish (es-ES), French (fr-FR), etc.
- Each language can have its own title, summaries, and artwork

**Genre Classification:**
- Primary genre is required (Action, Drama, Comedy, etc.)
- Up to 2 sub-genres can be added (total max: 3 genres including primary)

**Episodic Content:**
For TV show episodes, include the \`category\` field with:
- \`type\`: "Episode"
- \`sequenceNumber\`: Episode number
- \`parentContentId\`: Season or series content ID
      `,
        }),
        ApiBody({
            type: GenerateMECDto,
            description: 'MEC data for XML generation',
            examples: MEC_EXAMPLES,
        }),
        ApiResponse({
            status: 200,
            description: 'MEC XML file generated successfully',
            content: {
                'application/xml': {
                    schema: {
                        type: 'string',
                        example: '<?xml version="1.0" encoding="UTF-8"?><mdmec:CoreMetadata>...</mdmec:CoreMetadata>',
                    },
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: 'Invalid request payload',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            statusCode: { type: 'number', example: 400 },
                            message: {
                                type: 'array',
                                items: { type: 'string' },
                                example: [
                                    'contentId is required',
                                    'contentId must follow format: md:cid:org:{org}:{slug}',
                                    'localizedInfo must contain at least one entry',
                                ],
                            },
                            error: { type: 'string', example: 'Bad Request' },
                        },
                    },
                },
            },
        }),
    );
}
