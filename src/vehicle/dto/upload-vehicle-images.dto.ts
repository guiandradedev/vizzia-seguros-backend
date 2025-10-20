import { IsNotEmpty, IsNumberString } from 'class-validator';

export class UploadVehicleImagesDto {
  @IsNumberString() // Usamos IsNumberString pois dados de multipart/form-data chegam como string
  @IsNotEmpty()
  id_veiculo: string;
}