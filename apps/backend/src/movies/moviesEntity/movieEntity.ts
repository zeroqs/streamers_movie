import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Movie")
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text" })
  url: string;
}
