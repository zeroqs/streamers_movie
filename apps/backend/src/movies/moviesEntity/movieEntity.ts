import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";

@Entity("Movie")
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
	title: string;
	
	@Column({ type: "text" })
  imageSrc: string;

  @OneToMany(() => VideoQuality, videoQuality => videoQuality.movie)
  qualities: VideoQuality[];
}

@Entity("VideoQuality")
export class VideoQuality {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  quality: number;

  @Column({ type: "text" })
  url: string;

  @ManyToOne(() => Movie, movie => movie.qualities)
  movie: Movie;
}