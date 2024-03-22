import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('server')
export class ServerEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'type', type: 'char', length: 8, nullable: false })
  type: string;

  @Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ name: 'description', type: 'varchar', length: 500, nullable: false })
  description: string;

  @Column({ name: 'filePath', type: 'varchar', length: 100, nullable: false })
  filePath: string;

  @Column({ name: 'forderName', type: 'varchar', length: 30, nullable: false })
  forderName: string;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt: Date;
}
