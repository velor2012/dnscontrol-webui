import { IsNotEmpty } from "class-validator";

export class saveCredDto {
  @IsNotEmpty()
  content: string;
}