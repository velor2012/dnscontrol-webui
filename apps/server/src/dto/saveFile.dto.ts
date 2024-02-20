import { IsNotEmpty } from "class-validator";

export class saveFileDto {
  @IsNotEmpty()
  content: string;
  
  @IsNotEmpty()
  path: string;
}