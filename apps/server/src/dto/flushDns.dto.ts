import { IsNotEmpty } from "class-validator";

export class flushDnsDto {
  @IsNotEmpty()
  domain: string;
  
  dnsProvider?: string;
}