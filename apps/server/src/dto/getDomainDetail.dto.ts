import { IsNotEmpty } from "class-validator";

export class getDomainDetailDto {
  @IsNotEmpty()
  domain: string;
}