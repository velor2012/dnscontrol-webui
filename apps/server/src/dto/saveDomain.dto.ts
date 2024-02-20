import { IsNotEmpty } from "class-validator";

export class saveDomainDto {
  @IsNotEmpty()
  content: string;
  
  @IsNotEmpty()
  domain: string;
}