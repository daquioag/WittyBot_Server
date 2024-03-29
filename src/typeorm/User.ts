import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false,
  })
  username: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: 0 })
  apiCalls: number;

  @Column({ default: false })
  admin: boolean;
}
