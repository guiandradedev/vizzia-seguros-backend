// src/supabase/supabase.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {

    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseServiceRoleKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Supabase URL ou Service Role Key não encontrados nas variáveis de ambiente.');
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, bucket: string, userId: number) {
    const fileExtension = file.originalname.split('.').pop();
    
    const fileName = `cnh-user${userId}`; 
    const filePath = `public/${fileName}.${fileExtension}`;

    const { error } = await this.supabase.storage
      .from(bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false, // Não sobrescrever arquivos com o mesmo nome
      });

    if (error) {
      console.error('Erro no upload para o Supabase:', error);
      throw new InternalServerErrorException('Falha ao enviar o arquivo para o Supabase Storage.');
    }

    const { data } = this.supabase.storage.from(bucket).getPublicUrl(filePath);

    return {
      url: data.publicUrl,
      path: filePath,
    };
  }
}