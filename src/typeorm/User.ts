import { Entity, PrimaryGeneratedColumn, Column} from "typeorm";


@Entity({name: 'users2'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    username: string;
  
    @Column({ 
        unique: true,
        nullable: false 
    })
    email: string;
  
    @Column({ nullable: false })
    password: string;
  
    @Column({ default: 0 })
    apicalls: number;
  
    @Column({ nullable: true })
    token: string;
  
    @Column({ default: false })
    admin: boolean;
}