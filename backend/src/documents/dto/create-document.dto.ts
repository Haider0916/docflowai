import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class CreateDocumentDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    fileName!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    filePath!: string;
}
