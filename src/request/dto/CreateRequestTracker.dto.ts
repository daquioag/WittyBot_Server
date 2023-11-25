import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class RequestTrackerDto {
  @IsNotEmpty()
  @IsString()
  method: string;

  @IsNotEmpty()
  @IsString()
  endpoint: string;

  @IsNotEmpty()
  @IsInt()
  request_count: number;

  @IsOptional()
  @IsString()
  description?: string;
}
