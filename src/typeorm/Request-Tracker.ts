// request-tracking.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'request_tracking' })
export class RequestTracking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  method: string;

  @Column({ nullable: false })
  endpoint: string;

  @Column({ nullable: false, default: 0 })
  requestCount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_served_at: Date;

  @Column({ nullable: true })
  description: string;
}
