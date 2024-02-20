import { IsNotEmpty } from "class-validator";

export class delDomainDto {
  @IsNotEmpty()
  domain: string;
}