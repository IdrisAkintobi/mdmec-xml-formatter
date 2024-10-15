import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { FileVariant } from './file-variant.enum';

export class UploadMmcMecDto {
    @IsEnum(FileVariant)
    @IsNotEmpty()
    variant: FileVariant;

    @IsNumber()
    @IsOptional()
    from?: number;

    @IsNumber()
    @IsOptional()
    to?: number;
}
