import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAmocrmUserDto {
  @IsNotEmpty({ message: 'amocrmId не может быть пустым' })
  @IsString({ message: 'amocrmId должно быть строкой' })
  amocrmId: string;

  @IsNotEmpty({ message: 'extensionNumber не может быть пустым' })
  @IsString({ message: 'extensionNumber должно быть строкой' })
  extensionNumber: string;
}
