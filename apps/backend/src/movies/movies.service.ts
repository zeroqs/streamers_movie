import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Movies, MoviesInterface } from "./movies.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Movie, VideoQuality } from "./moviesEntity/movieEntity";
import { Repository } from "typeorm";

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
		private movieRepository: Repository<Movie>,
		@InjectRepository(VideoQuality)
    private videoQualityRepository: Repository<VideoQuality>,
	) { }
	
  findAll(): Promise<Movies[]> {
    return this.movieRepository.find({relations: {
        qualities: true,
    },});
	}
	
	getMovie(id : number): Promise<MoviesInterface> {
		return this.movieRepository.findOne(
			{
				where: {	id: id },
				relations: {
        qualities: true,
    },});
  }

  async create(dto: Movies) {
    const newMovie = this.movieRepository.create(dto);
    await this.movieRepository.save(newMovie);
    return newMovie;
	}
	
async addMovieWithQuality(title: string, quality: number, videoUrl: string): Promise<void | Error> {
	const movie = await this.movieRepository.findOne({ where: { title: title } });
    if (!movie) return new Error("Movie not found");

		const videoWithQuality = new VideoQuality();

    videoWithQuality.quality = quality;
    videoWithQuality.url = videoUrl;
    videoWithQuality.movie = movie;

    await this.videoQualityRepository.save(videoWithQuality);
}


  async delete(id: number) {
    const deleteResponse = await this.movieRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException("Post not found", HttpStatus.NOT_FOUND);
    }
  }
}
