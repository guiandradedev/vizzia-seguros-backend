import {
  Controller,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe, // Usado para validar que o ID é um UUID
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CnhImageService } from './cnh-image.service'; // Importe o novo serviço

@Controller('cnh')
export class CnhImageController {
  // Agora injetamos apenas o CnhImageService
  constructor(private readonly cnhImageService: CnhImageService) {}

  // A rota agora espera um userId como parâmetro na URL
  @HttpCode(HttpStatus.NOT_IMPLEMENTED)
  @Post('upload/:userId')
  @UseInterceptors(FileInterceptor('cnhImage'))
  async uploadCnhImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    
    // Captura o 'userId' da URL e valida se é um UUID
    @Param('userId') userId: string,
  ) {
    // Chama o método do serviço, que faz todo o trabalho pesado
    const savedImage = await this.cnhImageService.uploadAndSaveCnh(file, +userId);

    // O controller apenas formata a resposta final
    return {
      message: 'Imagem da CNH enviada com sucesso!',
      data: savedImage,
    };
  }
}