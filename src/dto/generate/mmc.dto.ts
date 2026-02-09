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
 */
export class VideoPictureDto {
    @ApiProperty({ example: '1080', description: 'Video height in pixels' })
    @IsString()
    heightPixels: string;

    @ApiProperty({ example: '1920', description: 'Video width in pixels' })
    @IsString()
    widthPixels: string;

    @ApiPropertyOptional({
        example: '16:9',
        description: 'Aspect ratio - Will be auto-calculated from dimensions if not provided',
    })
    @IsOptional()
    @IsString()
    aspectRatio?: string;

    @ApiPropertyOptional({ example: true, description: 'Whether video is progressive scan' })
    @IsOptional()
    @IsBoolean()
    progressive?: boolean;

    @ApiPropertyOptional({ example: 'TopFirst', description: 'Progressive scan order' })
    @IsOptional()
    @IsString()
    progressiveScanOrder?: string;
}

/**
 * Audio track information
 */
export class AudioTrackDto {
    @ApiPropertyOptional({
        example: 'md:audtrackid:org:wiflix:movie:audio1',
        description: 'Audio Track ID - Will be auto-generated if not provided',
    })
    @IsOptional()
    @IsString()
    trackId?: string;

    @ApiProperty({ example: 'stereo', description: 'Audio type (e.g., stereo, 5.1, mono)' })
    @IsString()
    type: string;

    @ApiProperty({ example: 'en-US', description: 'Audio language code (RFC 5646)' })
    @IsString()
    language: string;

    @ApiProperty({
        example: 'https://s3.amazonaws.com/bucket/audio/en.aac',
        description: 'Audio file location (URL or path)',
    })
    @IsString()
    location: string;

    @ApiPropertyOptional({ example: 'a1b2c3d4e5f6', description: 'MD5 hash of the audio file' })
    @IsOptional()
    @IsString()
    hash?: string;
}

/**
 * Video track information
 */
export class VideoTrackDto {
    @ApiPropertyOptional({
        example: 'md:vidtrackid:org:wiflix:movie:video',
        description: 'Video Track ID - Will be auto-generated if not provided',
    })
    @IsOptional()
    @IsString()
    trackId?: string;

    @ApiProperty({ example: 'primary', description: 'Video type (e.g., primary, trailer)' })
    @IsString()
    type: string;

    @ApiProperty({ example: 'en-US', description: 'Video language code (RFC 5646)' })
    @IsString()
    language: string;

    @ApiProperty({
        example: 'https://s3.amazonaws.com/bucket/video/main.mp4',
        description: 'Video file location (URL or path)',
    })
    @IsString()
    location: string;

    @ApiPropertyOptional({ example: 'v1i2d3e4o5f6', description: 'MD5 hash of the video file' })
    @IsOptional()
    @IsString()
    hash?: string;

    @ApiProperty({ type: VideoPictureDto, description: 'Video picture properties' })
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
 * Complete MMC (Media Manifest Core) data structure
 */
export class GenerateMMCDto {
    @ApiProperty({
        type: [AudioTrackDto],
        description: 'Array of audio tracks',
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
        description: 'Array of video tracks',
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
        description: 'Array of subtitle tracks (optional)',
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SubtitleTrackDto)
    subtitle?: SubtitleTrackDto[];

    @ApiPropertyOptional({
        type: [ImageAssetDto],
        description: 'Array of image assets (optional)',
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImageAssetDto)
    image?: ImageAssetDto[];

    @ApiProperty({
        type: [PresentationDto],
        description: 'Array of presentation configurations',
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
        description: 'Array of picture groups (optional)',
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
