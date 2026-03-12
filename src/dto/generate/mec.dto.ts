import { Type } from 'class-transformer';
import { IsString, IsOptional, IsArray, ValidateNested, IsEnum, IsObject } from 'class-validator';

/**
 * Work type enumeration
 */
export enum WorkTypeEnum {
    Movie = 'movie',
    Episode = 'episode',
    Promotion = 'promotion',
    Season = 'season',
    Series = 'series',
}

/**
 * Release type enumeration
 */
export enum ReleaseTypeEnum {
    Original = 'Original',
    Broadcast = 'Broadcast',
    DVD = 'DVD',
    BluRay = 'Blu-ray',
    PayTV = 'PayTV',
    InternetBuy = 'InternetBuy',
    InternetRent = 'InternetRent',
    Theatrical = 'Theatrical',
    SVOD = 'SVOD',
}

/**
 * Identifier namespace enumeration
 */
export enum NamespaceTypeEnum {
    EIDR = 'EIDR',
    ISAN = 'ISAN',
    IMDB = 'IMDB',
    ORG = 'ORG',
}

/**
 * Category type enumeration
 */
export enum CategoryEnum {
    Episode = 'Episode',
    Feature = 'Feature',
    Season = 'Season',
    Series = 'Series',
    Promotion = 'Promotion',
}

/**
 * Art reference (images, posters, etc.)
 */
export class ArtReferenceDto {
    @IsString()
    reference: string;
    @IsString()
    resolution: string;
    @IsString()
    purpose: string;
}

/**
 * Localized information for a specific language
 */
export class LocalizedInfoDto {
    @IsString()
    language: string;
    @IsString()
    titleDisplay: string;
    @IsOptional()
    @IsString()
    titleSort?: string;
    @IsOptional()
    @IsString()
    summary190?: string;
    @IsOptional()
    @IsString()
    summary400?: string;
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ArtReferenceDto)
    artReference?: ArtReferenceDto[];
}

/**
 * Genre classification
 */
export class GenreDto {
    @IsString()
    primary: string;
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    subGenre?: string[];
}

/**
 * Release history entry
 */
export class ReleaseHistoryDto {
    @IsEnum(ReleaseTypeEnum)
    type: ReleaseTypeEnum;
    @IsString()
    country: string;
    @IsString()
    date: string;
}

/**
 * Content identifier (EIDR, ISAN, IMDB, etc.)
 */
export class ContentIdentifierDto {
    @IsEnum(NamespaceTypeEnum)
    namespace: NamespaceTypeEnum;
    @IsString()
    value: string;
}

/**
 * Content rating
 */
export class RatingDto {
    @IsString()
    country: string;
    @IsString()
    system: string;
    @IsString()
    value: string;
}

/**
 * Cast or crew member
 */
export class CastMemberDto {
    @IsString()
    jobFunction: string;
    @IsString()
    billingBlockOrder: string;
    @IsObject()
    displayName: Record<string, string>;
}

/**
 * Organization information
 */
export class OrganizationDto {
    @IsString()
    id: string;
    @IsString()
    role: string;
}

/**
 * Company display credit
 */
export class CompanyCreditDto {
    @IsString()
    value: string;
    @IsString()
    language: string;
}

/**
 * Category information (for episodic content)
 */
export class CategoryInfoDto {
    @IsEnum(CategoryEnum)
    type: CategoryEnum;
    @IsOptional()
    @IsString()
    sequenceNumber?: string;
    @IsOptional()
    @IsString()
    parentTitleDisplay?: string;
    @IsOptional()
    @IsString()
    parentContentId?: string;
}

/**
 * MEC (Media Entertainment Core) metadata for content
 *
 * ContentID is auto-generated from title - just provide titleDisplay.
 * See /samples/json/mec-minimal.json and mec-complete.json for examples.
 */
export class GenerateMECDto {
    @IsOptional()
    @IsString()
    contentId?: string;
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => LocalizedInfoDto)
    localizedInfo: LocalizedInfoDto[];
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GenreDto)
    genre: GenreDto[];
    @IsOptional()
    @IsString()
    releaseYear?: string;
    @IsString()
    releaseDate: string;
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ReleaseHistoryDto)
    releaseHistory: ReleaseHistoryDto[];
    @IsEnum(WorkTypeEnum)
    workType: WorkTypeEnum;
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ContentIdentifierDto)
    identifier?: ContentIdentifierDto[];
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RatingDto)
    rating?: RatingDto[];
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CastMemberDto)
    cast: CastMemberDto[];
    @IsOptional()
    @IsString()
    originalLanguage?: string;
    @IsOptional()
    @ValidateNested()
    @Type(() => OrganizationDto)
    organization?: OrganizationDto;
    @IsOptional()
    @ValidateNested()
    @Type(() => CompanyCreditDto)
    companyDisplayCredit?: CompanyCreditDto;
    @IsOptional()
    @ValidateNested()
    @Type(() => CategoryInfoDto)
    category?: CategoryInfoDto;
}
