import {
    Body,
  Controller,
  Post,
  UploadedFiles, // 1. Mude para UploadedFiles
  UseInterceptors,
} from '@nestjs/common';
// 2. Mude para FilesInterceptor
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/multer/config/multer.config';
import { UploadVehicleImagesDto } from 'src/vehicle/dto/upload-vehicle-images.dto';

@Controller('files')
export class FilesController {
  @Post('upload/')
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  uploadMultiple(
    @Body() uploadVehicleDto: UploadVehicleImagesDto,
    @UploadedFiles() files: Array<Express.Multer.File>
) {
    const response = files.map(file => ({
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
    }));

    return {
        uploadVehicleDto,
        response
    };
  }
}