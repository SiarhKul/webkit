import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { Positions, Roles } from '../types/enums/index.js'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255, name: 'first_name' })
  firstName: string

  @Column({ type: 'varchar', length: 255, name: 'user_name' })
  lastName: string

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  email: string

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.USER,
  })
  role: Roles

  @Column({
    type: 'enum',
    enum: Positions,
    default: Positions.MANAGER,
  })
  position: Positions
}
