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
    @IsString()
    heightPixels: string;
    @IsString()
    widthPixels: string;
    @IsOptional()
    @IsString()
    aspectRatio?: string;
    @IsOptional()
    @IsBoolean()
    progressive?: boolean;
    @IsOptional()
    @IsString()
    progressiveScanOrder?: string;
}

/**
 * Audio track information
 */
export class AudioTrackDto {
    @IsOptional()
    @IsString()
    trackId?: string;
    @IsString()
    type: string;
    @IsString()
    language: string;
    @IsString()
    location: string;
    @IsOptional()
    @IsString()
    hash?: string;
}

/**
 * Video track information
 */
export class VideoTrackDto {
    @IsOptional()
    @IsString()
    trackId?: string;
    @IsString()
    type: string;
    @IsString()
    language: string;
    @IsString()
    location: string;
    @IsOptional()
    @IsString()
    hash?: string;
    @ValidateNested()
    @Type(() => VideoPictureDto)
    picture: VideoPictureDto;
}

/**
 * Subtitle track information
 */
export class SubtitleTrackDto {
    @IsOptional()
    @IsString()
    trackId?: string;
    @IsString()
    type: string;
    @IsString()
    language: string;
    @IsString()
    location: string;
    @IsOptional()
    @IsString()
    hash?: string;
    @IsString()
    frameRate: string;
    @IsString()
    frameRateMultiplier: string;
    @IsString()
    frameRateTimeCode: string;
}

/**
 * Image asset information
 */
export class ImageAssetDto {
    @IsOptional()
    @IsString()
    id?: string;
    @IsEnum(ImagePurposeEnum)
    purpose: ImagePurposeEnum;
    @IsString()
    language: string;
    @IsString()
    location: string;
}

/**
 * Presentation configuration
 */
export class PresentationDto {
    @IsOptional()
    @IsString()
    id?: string;
    @IsOptional()
    @IsString()
    trackNum?: string;
    @IsOptional()
    @IsString()
    videoId?: string;
    @IsOptional()
    @IsString()
    audioId?: string;
    @IsOptional()
    @IsString()
    subtitleId?: string;
}

/**
 * Picture group configuration
 */
export class PictureGroupDto {
    @IsOptional()
    @IsString()
    id?: string;
    @IsArray()
    @IsString({ each: true })
    imageIds: string[];
}

/**
 * Experience child relationship
 */
export class ExperienceChildDto {
    @IsString()
    id: string;

    @IsString()
    relationship: string;
}

/**
 * Experience configuration
 */
export class ExperienceDto {
    @IsOptional()
    @IsString()
    id?: string;
    @IsEnum(ExperienceTypeEnum)
    type: ExperienceTypeEnum;
    @IsString()
    subType: string;
    @IsOptional()
    @ValidateNested()
    @Type(() => ExperienceChildDto)
    child?: ExperienceChildDto;
}

/**
 * ALID to Experience mapping
 */
export class ALIDExperienceDto {
    @IsOptional()
    @IsString()
    alid?: string;
    @IsOptional()
    @IsString()
    experienceId?: string;
}

/**
 * MMC (Media Manifest Core) technical specifications for media files
 *
 * All IDs are auto-generated - just provide media locations and properties.
 * See /samples/json/mmc-minimal.json and mmc-multiple-tracks.json for examples.
 */
export class GenerateMMCDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AudioTrackDto)
    audio: AudioTrackDto[];
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VideoTrackDto)
    video: VideoTrackDto[];
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SubtitleTrackDto)
    subtitle?: SubtitleTrackDto[];
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImageAssetDto)
    image?: ImageAssetDto[];
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PresentationDto)
    presentation: PresentationDto[];
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PictureGroupDto)
    pictureGroup?: PictureGroupDto[];
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExperienceDto)
    experience: ExperienceDto[];
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ALIDExperienceDto)
    alidExperience: ALIDExperienceDto[];
    @IsOptional()
    @IsString()
    organization?: string;
}
