import { Transform, Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateVehicleImageDto {
    @IsNumber()
    @Type(() => Number)
    vehicle_id: number;

    @IsOptional()
    @Transform(({ value }) => {
      if (!value) return [];
      // se veio como string JSON no multipart form, parseia
      if (typeof value === 'string') {
        try { return JSON.parse(value); } catch { return value; }
      }
      return value;
    })
    @IsArray()
    photos?: any[];
}