import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { Positions, Roles } from '../types/enums/index.js'
import { Length, IsEmail } from 'class-validator'
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Length(0, 255)
  @Column({ type: 'varchar', length: 255, name: 'first_name' })
  firstName: string

  @Length(0, 255)
  @Column({ type: 'varchar', length: 255, name: 'user_name' })
  lastName: string

  @IsEmail()
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
