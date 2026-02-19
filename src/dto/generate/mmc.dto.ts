import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsArray, ValidateNested, IsBoolean, IsEnum } from 'class-validator';

/**
 * Image purpose enumeration
 */
export enum ImagePurposeEnum {
    Boxart = 'Boxart',
    Cover = 'Cover',
    Hero = 'Hero',
}

/**
 * Experience type enumeration
 */
export enum ExperienceTypeEnum {
    Movie = 'Movie',
    Series = 'Series',
    Season = 'Season',
    Episode = 'Episode',
}

/**
 * Video picture information
 *
 * **Required Fields:**
 * - heightPixels: Video height in pixels
 * - widthPixels: Video width in pixels
 *
 * **Optional Fields (Auto-generated if not provided):**
 * - aspectRatio: Calculated from height/width (e.g., 1920x1080 → 16:9)
 * - progressive: Progressive scan flag
 * - progressiveScanOrder: Scan order (TopFirst, BottomFirst)
 */
export class VideoPictureDto {
    @ApiProperty({
        example: '1080',
        description: '**REQUIRED** - Video height in pixels (e.g., 1080, 720, 2160)',
        required: true,
    })
    @IsString()
    heightPixels: string;

    @ApiProperty({
        example: '1920',
        description: '**REQUIRED** - Video width in pixels (e.g., 1920, 1280, 3840)',
        required: true,
    })
    @IsString()
    widthPixels: string;

    @ApiPropertyOptional({
        example: '16:9',
        description: '**OPTIONAL** - Aspect ratio (e.g., 16:9, 4:3). Auto-calculated from dimensions if not provided.',
        required: false,
    })
    @IsOptional()
    @IsString()
    aspectRatio?: string;

    @ApiPropertyOptional({
        example: true,
        description: '**OPTIONAL** - Whether video is progressive scan (true/false)',
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    progressive?: boolean;

    @ApiPropertyOptional({
        example: 'TopFirst',
        description: '**OPTIONAL** - Progressive scan order (TopFirst, BottomFirst)',
        required: false,
    })
    @IsOptional()
    @IsString()
    progressiveScanOrder?: string;
}

/**
 * Audio track information
 *
 * **Required Fields:**
 * - type: Audio type (stereo, 5.1, 7.1, mono, etc.)
 * - language: Language code (RFC 5646 format, e.g., en-US, es-ES)
 * - location: Audio file URL or path
 *
 * **Optional Fields (Auto-generated if not provided):**
 * - trackId: Generated as md:audtrackid:org:{org}:{slug}:audio-{lang}
 * - hash: MD5 hash of audio file
 */
export class AudioTrackDto {
    @ApiPropertyOptional({
        example: 'md:audtrackid:org:wiflix:movie:audio-en-us',
        description:
            '**OPTIONAL** - Audio Track ID (MovieLabs format). Auto-generated from video URL slug and language if not provided. Format: md:audtrackid:org:{organization}:{content-slug}:audio-{language}',
        required: false,
    })
    @IsOptional()
    @IsString()
    trackId?: string;

    @ApiProperty({
        example: 'stereo',
        description: '**REQUIRED** - Audio type. Common values: stereo, 5.1, 7.1, mono, Atmos',
        required: true,
    })
    @IsString()
    type: string;

    @ApiProperty({
        example: 'en-US',
        description: '**REQUIRED** - Audio language code (RFC 5646). Examples: en-US, es-ES, fr-FR, de-DE, ja-JP',
        required: true,
    })
    @IsString()
    language: string;

    @ApiProperty({
        example: 'https://s3.amazonaws.com/bucket/audio/en.aac',
        description:
            '**REQUIRED** - Audio file location (URL or path). Supported formats: AAC, MP3, WAV, FLAC, AC3, EAC3',
        required: true,
    })
    @IsString()
    location: string;

    @ApiPropertyOptional({
        example: 'a1b2c3d4e5f6789',
        description: '**OPTIONAL** - MD5 hash of the audio file for integrity verification',
        required: false,
    })
    @IsOptional()
    @IsString()
    hash?: string;
}

/**
 * Video track information
 *
 * **Required Fields:**
 * - type: Video type (primary, trailer, bonus, etc.)
 * - language: Language code (RFC 5646 format)
 * - location: Video file URL or path
 * - picture: Video dimensions and properties
 *
 * **Optional Fields (Auto-generated if not provided):**
 * - trackId: Generated as md:vidtrackid:org:{org}:{slug}:video-{lang}
 * - hash: MD5 hash of video file
 */
export class VideoTrackDto {
    @ApiPropertyOptional({
        example: 'md:vidtrackid:org:wiflix:movie:video-en-us',
        description:
            '**OPTIONAL** - Video Track ID (MovieLabs format). Auto-generated from video URL slug and language if not provided. Format: md:vidtrackid:org:{organization}:{content-slug}:video-{language}',
        required: false,
    })
    @IsOptional()
    @IsString()
    trackId?: string;

    @ApiProperty({
        example: 'primary',
        description: '**REQUIRED** - Video type. Common values: primary, trailer, bonus, preview',
        required: true,
    })
    @IsString()
    type: string;

    @ApiProperty({
        example: 'en-US',
        description: '**REQUIRED** - Video language code (RFC 5646). Examples: en-US, es-ES, fr-FR',
        required: true,
    })
    @IsString()
    language: string;

    @ApiProperty({
        example: 'https://s3.amazonaws.com/bucket/video/main.mp4',
        description:
            '**REQUIRED** - Video file location (URL or path). The content slug will be extracted from the first path segment after the domain. Example: https://cdn.com/my-movie/video.mp4 → slug: my-movie',
        required: true,
    })
    @IsString()
    location: string;

    @ApiPropertyOptional({
        example: 'v1i2d3e4o5h6a7s8h',
        description: '**OPTIONAL** - MD5 hash of the video file for integrity verification',
        required: false,
    })
    @IsOptional()
    @IsString()
    hash?: string;

    @ApiProperty({
        type: VideoPictureDto,
        description: '**REQUIRED** - Video picture properties including dimensions',
        required: true,
    })
    @ValidateNested()
    @Type(() => VideoPictureDto)
    picture: VideoPictureDto;
}

/**
 * Subtitle track information
 */
export class SubtitleTrackDto {
    @ApiPropertyOptional({
        example: 'md:subtitletrackid:org:wiflix:movie:subtitle1',
        description: 'Subtitle Track ID - Will be auto-generated if not provided',
    })
    @IsOptional()
    @IsString()
    trackId?: string;

    @ApiProperty({ example: 'open', description: 'Subtitle type (e.g., open, closed)' })
    @IsString()
    type: string;

    @ApiProperty({ example: 'en-US', description: 'Subtitle language code (RFC 5646)' })
    @IsString()
    language: string;

    @ApiProperty({
        example: 'https://s3.amazonaws.com/bucket/subtitles/en.srt',
        description: 'Subtitle file location (URL or path)',
    })
    @IsString()
    location: string;

    @ApiPropertyOptional({ example: 's1u2b3t4i5t6', description: 'MD5 hash of the subtitle file' })
    @IsOptional()
    @IsString()
    hash?: string;

    @ApiProperty({ example: '23.976', description: 'Frame rate' })
    @IsString()
    frameRate: string;

    @ApiProperty({ example: '1001/1000', description: 'Frame rate multiplier' })
    @IsString()
    frameRateMultiplier: string;

    @ApiProperty({ example: 'NonDrop', description: 'Frame rate timecode (NonDrop, DropFrame)' })
    @IsString()
    frameRateTimeCode: string;
}

/**
 * Image asset information
 */
export class ImageAssetDto {
    @ApiPropertyOptional({
        example: 'md:imageid:org:wiflix:movie:cover',
        description: 'Image ID - Will be auto-generated if not provided',
    })
    @IsOptional()
    @IsString()
    id?: string;

    @ApiProperty({
        enum: ImagePurposeEnum,
        example: ImagePurposeEnum.Cover,
        description: 'Image purpose',
    })
    @IsEnum(ImagePurposeEnum)
    purpose: ImagePurposeEnum;

    @ApiProperty({ example: 'en-US', description: 'Image language code (RFC 5646)' })
    @IsString()
    language: string;

    @ApiProperty({
        example: 'https://s3.amazonaws.com/bucket/images/cover.jpg',
        description: 'Image file location (URL or path)',
    })
    @IsString()
    location: string;
}

/**
 * Presentation configuration
 */
export class PresentationDto {
    @ApiPropertyOptional({
        example: 'md:presentationid:org:wiflix:movie:presentation',
        description: 'Presentation ID - Will be auto-generated if not provided',
    })
    @IsOptional()
    @IsString()
    id?: string;

    @ApiPropertyOptional({
        example: '0',
        description: 'Track selection number - Defaults to "0" if not provided',
    })
    @IsOptional()
    @IsString()
    trackNum?: string;

    @ApiPropertyOptional({
        example: 'md:vidtrackid:org:wiflix:movie:video',
        description: 'Video Track ID reference - Will be auto-generated if not provided',
    })
    @IsOptional()
    @IsString()
    videoId?: string;

    @ApiPropertyOptional({
        example: 'md:audtrackid:org:wiflix:movie:audio1',
        description: 'Audio Track ID reference - Will be auto-generated if not provided',
    })
    @IsOptional()
    @IsString()
    audioId?: string;

    @ApiPropertyOptional({
        example: 'md:subtitletrackid:org:wiflix:movie:subtitle1',
        description: 'Subtitle Track ID reference (optional)',
    })
    @IsOptional()
    @IsString()
    subtitleId?: string;
}

/**
 * Picture group configuration
 */
export class PictureGroupDto {
    @ApiPropertyOptional({
        example: 'md:picturegroupid:org:wiflix:movie:group1',
        description: 'Picture Group ID - Will be auto-generated if not provided',
    })
    @IsOptional()
    @IsString()
    id?: string;

    @ApiProperty({
        type: [String],
        example: ['md:imageid:org:wiflix:movie:image1', 'md:imageid:org:wiflix:movie:image2'],
        description: 'Array of Image IDs in this group',
    })
    @IsArray()
    @IsString({ each: true })
    imageIds: string[];
}

/**
 * Experience child relationship
 */
export class ExperienceChildDto {
    @ApiProperty({
        example: 'md:experienceid:org:wiflix:movie:trailer',
        description: 'Child Experience ID',
    })
    @IsString()
    id: string;

    @ApiProperty({ example: 'ischildof', description: 'Relationship type' })
    @IsString()
    relationship: string;
}

/**
 * Experience configuration
 */
export class ExperienceDto {
    @ApiPropertyOptional({
        example: 'md:experienceid:org:wiflix:movie:experience',
        description: 'Experience ID - Will be auto-generated if not provided',
    })
    @IsOptional()
    @IsString()
    id?: string;

    @ApiProperty({
        enum: ExperienceTypeEnum,
        example: ExperienceTypeEnum.Movie,
        description: 'Experience type',
    })
    @IsEnum(ExperienceTypeEnum)
    type: ExperienceTypeEnum;

    @ApiProperty({ example: 'Feature', description: 'Experience sub-type (e.g., Feature, Episode)' })
    @IsString()
    subType: string;

    @ApiPropertyOptional({
        type: ExperienceChildDto,
        description: 'Child experience relationship (optional)',
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => ExperienceChildDto)
    child?: ExperienceChildDto;
}

/**
 * ALID to Experience mapping
 */
export class ALIDExperienceDto {
    @ApiPropertyOptional({
        example: 'md:ALID:org:wiflix:movie',
        description: 'ALID - Will be auto-generated if not provided',
    })
    @IsOptional()
    @IsString()
    alid?: string;

    @ApiPropertyOptional({
        example: 'md:experienceid:org:wiflix:movie:experience',
        description: 'Experience ID - Auto-derived from experience array',
    })
    @IsOptional()
    @IsString()
    experienceId?: string;
}

/**
 * Complete MMC (Media Manifest Core) data structure for XML generation
 *
 * **MMC contains technical specifications about your media files:**
 * - Video, audio, and subtitle track information
 * - Presentations (how tracks are combined)
 * - Experiences (content type: Movie, Series, Episode)
 * - Image assets for artwork
 *
 * **REQUIRED TOP-LEVEL FIELDS:**
 * - audio: Array of audio tracks (at least 1)
 * - video: Array of video tracks (at least 1)
 * - presentation: Array of presentations (at least 1, can be empty object)
 * - experience: Array of experiences (at least 1)
 * - alidExperience: Array of ALID mappings (at least 1, can be empty object)
 *
 * **OPTIONAL TOP-LEVEL FIELDS:**
 * - subtitle: Subtitle tracks
 * - image: Image assets (cover, hero, boxart)
 * - pictureGroup: Groupings of images
 * - organization: Organization name (defaults to "wiflix")
 *
 * **AUTO-GENERATION:**
 * All track IDs, presentation IDs, experience IDs, and ALIDs are auto-generated from:
 * - Video location URL (first path segment after domain becomes content slug)
 * - Language codes (for unique multi-language track IDs)
 * - Organization name
 *
 * Example: https://cdn.com/my-movie/video.mp4
 * - Content slug: my-movie
 * - Generated video ID: md:vidtrackid:org:wiflix:my-movie:video-en-us
 *
 * **FOR MULTI-LANGUAGE CONTENT:**
 * Add multiple audio/subtitle tracks with different language codes.
 * Track IDs will automatically include language for uniqueness:
 * - audio-en-us, audio-es-es, audio-fr-fr
 * - subtitle-en-us, subtitle-es-es, subtitle-fr-fr
 */
export class GenerateMMCDto {
    @ApiProperty({
        type: [AudioTrackDto],
        description: '**REQUIRED** - Array of audio tracks (at least 1). Each track requires: type, language, location',
        required: true,
        isArray: true,
        minItems: 1,
        example: [
            {
                type: 'stereo',
                language: 'en-US',
                location: 'https://s3.amazonaws.com/bucket/audio/en.aac',
            },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AudioTrackDto)
    audio: AudioTrackDto[];

    @ApiProperty({
        type: [VideoTrackDto],
        description:
            '**REQUIRED** - Array of video tracks (at least 1). Each track requires: type, language, location, picture (with heightPixels and widthPixels)',
        required: true,
        isArray: true,
        minItems: 1,
        example: [
            {
                type: 'primary',
                language: 'en-US',
                location: 'https://s3.amazonaws.com/bucket/video/main.mp4',
                picture: {
                    heightPixels: '1080',
                    widthPixels: '1920',
                },
            },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VideoTrackDto)
    video: VideoTrackDto[];

    @ApiPropertyOptional({
        type: [SubtitleTrackDto],
        description:
            '**OPTIONAL** - Array of subtitle tracks. Each track requires: type, language, location, frameRate, frameRateMultiplier, frameRateTimeCode',
        required: false,
        isArray: true,
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SubtitleTrackDto)
    subtitle?: SubtitleTrackDto[];

    @ApiPropertyOptional({
        type: [ImageAssetDto],
        description:
            '**OPTIONAL** - Array of image assets (cover art, hero images, boxart). Each image requires: purpose, language, location',
        required: false,
        isArray: true,
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImageAssetDto)
    image?: ImageAssetDto[];

    @ApiProperty({
        type: [PresentationDto],
        description:
            '**REQUIRED** - Array of presentations (at least 1). Presentations link video, audio, and subtitle tracks together. Can be an empty object {} to use defaults. All track references will be auto-generated.',
        required: true,
        isArray: true,
        minItems: 1,
        example: [
            {
                trackNum: '0',
            },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PresentationDto)
    presentation: PresentationDto[];

    @ApiPropertyOptional({
        type: [PictureGroupDto],
        description:
            '**OPTIONAL** - Array of picture groups. Groups multiple images together (e.g., different resolutions of the same artwork)',
        required: false,
        isArray: true,
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PictureGroupDto)
    pictureGroup?: PictureGroupDto[];

    @ApiProperty({
        type: [ExperienceDto],
        description: 'Array of experience definitions',
        example: [
            {
                type: 'Movie',
                subType: 'Feature',
            },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExperienceDto)
    experience: ExperienceDto[];

    @ApiProperty({
        type: [ALIDExperienceDto],
        description: 'Array of ALID to Experience mappings',
        example: [{}],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ALIDExperienceDto)
    alidExperience: ALIDExperienceDto[];

    @ApiPropertyOptional({
        example: 'wiflix',
        description: 'Organization name for auto-generating IDs (optional, defaults to "wiflix")',
        default: 'wiflix',
    })
    @IsOptional()
    @IsString()
    organization?: string;
}
