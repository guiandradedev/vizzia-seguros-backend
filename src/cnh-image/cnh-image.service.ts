import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CnhImage } from './entities/cnh-image.entity';

@Injectable() // Torna a classe injetável
export class CnhImageService {
  constructor(
    @InjectRepository(CnhImage)
    private readonly cnhImageRepository: Repository<CnhImage>,
  ) {}

  async uploadAndSaveCnh(
    file: Express.Multer.File,
    userId: number,
  ) {
    // // 1. Faz o upload para o Supabase usando o nome de arquivo customizado
    // // const uploadResult = await this.supabaseService.uploadFile(
    // //   file,
    // //   'files', // Nome do bucket
    // //   userId,
    // // );

    // // 2. Cria a nova entidade com os dados retornados
    // const newCnhImage = this.cnhImageRepository.create({
    //   url: uploadResult.url,
    //   path: uploadResult.path,
    //   mimetype: file.mimetype,
    //   sizeBytes: file.size,
    //   // Se você tiver uma relação com a entidade User, pode associá-la aqui:
    //   // user: { id: userId },
    // });

    // // 3. Salva a entidade no banco e a retorna
    // return this.cnhImageRepository.save(newCnhImage);
  }
}