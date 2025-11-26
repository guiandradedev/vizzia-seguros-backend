import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('cnh_images') // Define o nome da tabela no banco de dados
export class CnhImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' }) // 'text' é mais seguro para URLs longas
  url: string;

  @Column({ unique: true })
  path: string; // O caminho do arquivo no Supabase Storage

  @Column()
  mimetype: string;

  @Column({ type: 'int' })
  sizeBytes: number;

  @CreateDateColumn()
  createdAt: Date;
}