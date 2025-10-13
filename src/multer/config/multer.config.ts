import { diskStorage } from 'multer';
import { randomBytes } from 'crypto';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

// Função para filtrar apenas imagens
const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new BadRequestException('Apenas arquivos de imagem (jpg, jpeg, png, gif) são permitidos!'),
      false,
    );
  }
  callback(null, true);
};

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const hash = randomBytes(8).toString('hex');
      const filename = `${hash}-${file.originalname}`;
      callback(null, filename);
    },
  }),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  // --- ADICIONE ESTA PARTE ---
  fileFilter: imageFileFilter,
};