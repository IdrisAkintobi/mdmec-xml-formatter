import { IsEnum, IsNotEmpty } from 'class-validator';
import { FileVariant } from './file-variant.enum';

export class UploadMmcMecDto {
    @IsEnum(FileVariant)
    @IsNotEmpty()
    variant: FileVariant;
}
