import { IsNotEmpty } from "class-validator";

export class getFileDto {
  @IsNotEmpty()
  path: string;
}