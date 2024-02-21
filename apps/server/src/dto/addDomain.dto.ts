import { IsNotEmpty } from "class-validator";

export class addDomainDto {
  @IsNotEmpty()
  domain: string;
}