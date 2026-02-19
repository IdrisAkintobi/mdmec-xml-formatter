import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
    @ApiProperty({ example: 'https://s3.amazonaws.com/bucket/images/cover.jpg' })
    @IsString()
    reference: string;

    @ApiProperty({ example: '1920x1080' })
    @IsString()
    resolution: string;

    @ApiProperty({ example: 'cover' })
    @IsString()
    purpose: string;
}

/**
 * Localized information for a specific language
 */
export class LocalizedInfoDto {
    @ApiProperty({ example: 'en-US' })
    @IsString()
    language: string;

    @ApiProperty({ example: 'The Matrix' })
    @IsString()
    titleDisplay: string;

    @ApiPropertyOptional({ example: 'Matrix' })
    @IsOptional()
    @IsString()
    titleSort?: string;

    @ApiPropertyOptional({ example: 'A computer hacker learns about the true nature of his reality.' })
    @IsOptional()
    @IsString()
    summary190?: string;

    @ApiPropertyOptional({
        example:
            'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    })
    @IsOptional()
    @IsString()
    summary400?: string;

    @ApiPropertyOptional({ type: [ArtReferenceDto] })
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
    @ApiProperty({ example: 'Action' })
    @IsString()
    primary: string;

    @ApiPropertyOptional({ type: [String], example: ['Adventure', 'Thriller'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    subGenre?: string[];
}

/**
 * Release history entry
 */
export class ReleaseHistoryDto {
    @ApiProperty({ enum: ReleaseTypeEnum, example: ReleaseTypeEnum.Original })
    @IsEnum(ReleaseTypeEnum)
    type: ReleaseTypeEnum;

    @ApiProperty({ example: 'US' })
    @IsString()
    country: string;

    @ApiProperty({ example: '1999-03-31' })
    @IsString()
    date: string;
}

/**
 * Content identifier (EIDR, ISAN, IMDB, etc.)
 */
export class ContentIdentifierDto {
    @ApiProperty({ enum: NamespaceTypeEnum, example: NamespaceTypeEnum.ORG })
    @IsEnum(NamespaceTypeEnum)
    namespace: NamespaceTypeEnum;

    @ApiProperty({ example: 'wiflix-matrix-001' })
    @IsString()
    value: string;
}

/**
 * Content rating
 */
export class RatingDto {
    @ApiProperty({ example: 'US' })
    @IsString()
    country: string;

    @ApiProperty({ example: 'MPAA' })
    @IsString()
    system: string;

    @ApiProperty({ example: 'R' })
    @IsString()
    value: string;
}

/**
 * Cast or crew member
 */
export class CastMemberDto {
    @ApiProperty({ example: 'Actor' })
    @IsString()
    jobFunction: string;

    @ApiProperty({ example: '1' })
    @IsString()
    billingBlockOrder: string;

    @ApiProperty({ example: { 'en-US': 'Keanu Reeves', 'ja-JP': 'キアヌ・リーブス' } })
    @IsObject()
    displayName: Record<string, string>;
}

/**
 * Organization information
 */
export class OrganizationDto {
    @ApiProperty({ example: 'md:orgid:wiflix' })
    @IsString()
    id: string;

    @ApiProperty({ example: 'licensor' })
    @IsString()
    role: string;
}

/**
 * Company display credit
 */
export class CompanyCreditDto {
    @ApiProperty({ example: 'WiFlix Studios' })
    @IsString()
    value: string;

    @ApiProperty({ example: 'en-US' })
    @IsString()
    language: string;
}

/**
 * Category information (for episodic content)
 */
export class CategoryInfoDto {
    @ApiProperty({ enum: CategoryEnum, example: CategoryEnum.Episode })
    @IsEnum(CategoryEnum)
    type: CategoryEnum;

    @ApiPropertyOptional({ example: '1' })
    @IsOptional()
    @IsString()
    sequenceNumber?: string;

    @ApiPropertyOptional({
        example: 'Game of Thrones Season 1',
        description: 'Auto-generates parentContentId from simple title. Provide either this or parentContentId.',
    })
    @IsOptional()
    @IsString()
    parentTitleDisplay?: string;

    @ApiPropertyOptional({ example: 'md:cid:org:wiflix:series-name' })
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
    @ApiPropertyOptional({ description: 'Auto-generated from titleDisplay if not provided' })
    @IsOptional()
    @IsString()
    contentId?: string;

    @ApiProperty({
        type: [LocalizedInfoDto],
        example: [
            {
                language: 'en-US',
                titleDisplay: 'The Matrix',
                summary400: 'A computer hacker learns about the true nature of reality.',
            },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => LocalizedInfoDto)
    localizedInfo: LocalizedInfoDto[];

    @ApiProperty({
        type: [GenreDto],
        example: [{ primary: 'Action', subGenre: ['Sci-Fi', 'Thriller'] }],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GenreDto)
    genre: GenreDto[];

    @ApiPropertyOptional({ example: '1999', description: 'Auto-extracted from releaseDate if not provided' })
    @IsOptional()
    @IsString()
    releaseYear?: string;

    @ApiProperty({ example: '1999-03-31' })
    @IsString()
    releaseDate: string;

    @ApiProperty({
        type: [ReleaseHistoryDto],
        example: [{ type: 'Theatrical', country: 'US', date: '1999-03-31' }],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ReleaseHistoryDto)
    releaseHistory: ReleaseHistoryDto[];

    @ApiProperty({ enum: WorkTypeEnum, example: WorkTypeEnum.Movie })
    @IsEnum(WorkTypeEnum)
    workType: WorkTypeEnum;

    @ApiPropertyOptional({
        type: [ContentIdentifierDto],
        example: [{ namespace: 'ORG', value: 'wiflix-matrix-001' }],
        description: 'Auto-generated from contentId if not provided',
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ContentIdentifierDto)
    identifier?: ContentIdentifierDto[];

    @ApiPropertyOptional({
        type: [RatingDto],
        example: [{ country: 'US', system: 'MPAA', value: 'R' }],
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RatingDto)
    rating?: RatingDto[];

    @ApiProperty({
        type: [CastMemberDto],
        example: [{ jobFunction: 'Actor', billingBlockOrder: '1', displayName: { 'en-US': 'Keanu Reeves' } }],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CastMemberDto)
    cast: CastMemberDto[];

    @ApiPropertyOptional({
        example: 'en',
        description: 'Auto-defaults to first localizedInfo language if not provided',
    })
    @IsOptional()
    @IsString()
    originalLanguage?: string;

    @ApiPropertyOptional({
        type: OrganizationDto,
        example: { id: 'md:orgid:wiflix', role: 'licensor' },
        description: 'Auto-generated from configured organization if not provided',
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => OrganizationDto)
    organization?: OrganizationDto;

    @ApiPropertyOptional({
        type: CompanyCreditDto,
        example: { value: 'WiFlix Studios', language: 'en-US' },
        description: 'Auto-generated from configured organization if not provided',
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => CompanyCreditDto)
    companyDisplayCredit?: CompanyCreditDto;

    @ApiPropertyOptional({ type: CategoryInfoDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => CategoryInfoDto)
    category?: CategoryInfoDto;
}
