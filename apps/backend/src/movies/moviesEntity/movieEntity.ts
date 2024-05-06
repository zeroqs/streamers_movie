import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("Movie")
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
	title: string;
	
	@Column({ type: "text" })
	imageSrc: string;
	
	@Column({ type: "text" })
  movieSrc: string;
}

