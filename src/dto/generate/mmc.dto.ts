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
    @ApiProperty({ example: '1080' })
    @IsString()
    heightPixels: string;

    @ApiProperty({ example: '1920' })
    @IsString()
    widthPixels: string;

    @ApiPropertyOptional({ example: '16:9', description: 'Auto-calculated if not provided' })
    @IsOptional()
    @IsString()
    aspectRatio?: string;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    progressive?: boolean;

    @ApiPropertyOptional({ example: 'TopFirst' })
    @IsOptional()
    @IsString()
    progressiveScanOrder?: string;
}

/**
 * Audio track information
 */
export class AudioTrackDto {
    @ApiPropertyOptional({
        example: 'md:audtrackid:org:wiflix:movie:audio-en-us',
        description: 'Auto-generated if not provided',
    })
    @IsOptional()
    @IsString()
    trackId?: string;

    @ApiProperty({ example: 'stereo' })
    @IsString()
    type: string;

    @ApiProperty({ example: 'en-US' })
    @IsString()
    language: string;

    @ApiProperty({ example: 'https://s3.amazonaws.com/bucket/audio/en.aac' })
    @IsString()
    location: string;

    @ApiPropertyOptional({ example: 'a1b2c3d4e5f6789' })
    @IsOptional()
    @IsString()
    hash?: string;
}

/**
 * Video track information
 */
export class VideoTrackDto {
    @ApiPropertyOptional({
        example: 'md:vidtrackid:org:wiflix:movie:video-en-us',
        description: 'Auto-generated if not provided',
    })
    @IsOptional()
    @IsString()
    trackId?: string;

    @ApiProperty({ example: 'primary' })
    @IsString()
    type: string;

    @ApiProperty({ example: 'en-US' })
    @IsString()
    language: string;

    @ApiProperty({ example: 'https://s3.amazonaws.com/bucket/video/main.mp4' })
    @IsString()
    location: string;

    @ApiPropertyOptional({ example: 'v1i2d3e4o5h6a7s8h' })
    @IsOptional()
    @IsString()
    hash?: string;

    @ApiProperty({ type: VideoPictureDto })
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
        description: 'Auto-generated if not provided',
    })
    @IsOptional()
    @IsString()
    trackId?: string;

    @ApiProperty({ example: 'open' })
    @IsString()
    type: string;

    @ApiProperty({ example: 'en-US' })
    @IsString()
    language: string;

    @ApiProperty({ example: 'https://s3.amazonaws.com/bucket/subtitles/en.srt' })
    @IsString()
    location: string;

    @ApiPropertyOptional({ example: 's1u2b3t4i5t6' })
    @IsOptional()
    @IsString()
    hash?: string;

    @ApiProperty({ example: '23.976' })
    @IsString()
    frameRate: string;

    @ApiProperty({ example: '1001/1000' })
    @IsString()
    frameRateMultiplier: string;

    @ApiProperty({ example: 'NonDrop' })
    @IsString()
    frameRateTimeCode: string;
}

/**
 * Image asset information
 */
export class ImageAssetDto {
    @ApiPropertyOptional({
        example: 'md:imageid:org:wiflix:movie:cover',
        description: 'Auto-generated if not provided',
    })
    @IsOptional()
    @IsString()
    id?: string;

    @ApiProperty({ enum: ImagePurposeEnum, example: ImagePurposeEnum.Cover })
    @IsEnum(ImagePurposeEnum)
    purpose: ImagePurposeEnum;

    @ApiProperty({ example: 'en-US' })
    @IsString()
    language: string;

    @ApiProperty({ example: 'https://s3.amazonaws.com/bucket/images/cover.jpg' })
    @IsString()
    location: string;
}

/**
 * Presentation configuration
 */
export class PresentationDto {
    @ApiPropertyOptional({
        example: 'md:presentationid:org:wiflix:movie:presentation',
        description: 'Auto-generated if not provided',
    })
    @IsOptional()
    @IsString()
    id?: string;

    @ApiPropertyOptional({ example: '0' })
    @IsOptional()
    @IsString()
    trackNum?: string;

    @ApiPropertyOptional({
        example: 'md:vidtrackid:org:wiflix:movie:video',
        description: 'Auto-generated if not provided',
    })
    @IsOptional()
    @IsString()
    videoId?: string;

    @ApiPropertyOptional({
        example: 'md:audtrackid:org:wiflix:movie:audio1',
        description: 'Auto-generated if not provided',
    })
    @IsOptional()
    @IsString()
    audioId?: string;

    @ApiPropertyOptional({ example: 'md:subtitletrackid:org:wiflix:movie:subtitle1' })
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
        description: 'Auto-generated if not provided',
    })
    @IsOptional()
    @IsString()
    id?: string;

    @ApiProperty({
        type: [String],
        example: ['md:imageid:org:wiflix:movie:image1', 'md:imageid:org:wiflix:movie:image2'],
    })
    @IsArray()
    @IsString({ each: true })
    imageIds: string[];
}

/**
 * Experience child relationship
 */
export class ExperienceChildDto {
    @ApiProperty({ example: 'md:experienceid:org:wiflix:movie:trailer' })
    @IsString()
    id: string;

    @ApiProperty({ example: 'ischildof' })
    @IsString()
    relationship: string;
}

/**
 * Experience configuration
 */
export class ExperienceDto {
    @ApiPropertyOptional({
        example: 'md:experienceid:org:wiflix:movie:experience',
        description: 'Auto-generated if not provided',
    })
    @IsOptional()
    @IsString()
    id?: string;

    @ApiProperty({ enum: ExperienceTypeEnum, example: ExperienceTypeEnum.Movie })
    @IsEnum(ExperienceTypeEnum)
    type: ExperienceTypeEnum;

    @ApiProperty({ example: 'Feature' })
    @IsString()
    subType: string;

    @ApiPropertyOptional({ type: ExperienceChildDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => ExperienceChildDto)
    child?: ExperienceChildDto;
}

/**
 * ALID to Experience mapping
 */
export class ALIDExperienceDto {
    @ApiPropertyOptional({ example: 'md:ALID:org:wiflix:movie', description: 'Auto-generated if not provided' })
    @IsOptional()
    @IsString()
    alid?: string;

    @ApiPropertyOptional({
        example: 'md:experienceid:org:wiflix:movie:experience',
        description: 'Auto-derived from experience array',
    })
    @IsOptional()
    @IsString()
    experienceId?: string;
}

/**
 * MMC (Media Manifest Core) technical specifications for media files
 *
 * Contains video, audio, subtitle tracks and how they're combined into presentations.
 * See /samples/json/mmc-minimal.json and mmc-multiple-tracks.json for full examples.
 */
export class GenerateMMCDto {
    @ApiProperty({
        type: [AudioTrackDto],
        example: [{ type: 'stereo', language: 'en-US', location: 'https://s3.amazonaws.com/bucket/audio/en.aac' }],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AudioTrackDto)
    audio: AudioTrackDto[];

    @ApiProperty({
        type: [VideoTrackDto],
        example: [
            {
                type: 'primary',
                language: 'en-US',
                location: 'https://s3.amazonaws.com/bucket/video/main.mp4',
                picture: { heightPixels: '1080', widthPixels: '1920' },
            },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VideoTrackDto)
    video: VideoTrackDto[];

    @ApiPropertyOptional({ type: [SubtitleTrackDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SubtitleTrackDto)
    subtitle?: SubtitleTrackDto[];

    @ApiPropertyOptional({ type: [ImageAssetDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImageAssetDto)
    image?: ImageAssetDto[];

    @ApiProperty({
        type: [PresentationDto],
        description: 'Links tracks together. Use empty object {} for defaults.',
        example: [{ trackNum: '0' }],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PresentationDto)
    presentation: PresentationDto[];

    @ApiPropertyOptional({ type: [PictureGroupDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PictureGroupDto)
    pictureGroup?: PictureGroupDto[];

    @ApiProperty({ type: [ExperienceDto], example: [{ type: 'Movie', subType: 'Feature' }] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExperienceDto)
    experience: ExperienceDto[];

    @ApiProperty({ type: [ALIDExperienceDto], example: [{}] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ALIDExperienceDto)
    alidExperience: ALIDExperienceDto[];

    @ApiPropertyOptional({ example: 'wiflix', description: 'Defaults to configured organization' })
    @IsOptional()
    @IsString()
    organization?: string;
}
