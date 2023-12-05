import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Movies } from "./movies.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Movie } from "./moviesEntity/movieEntity";
import { Repository } from "typeorm";

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private usersRepository: Repository<Movie>,
  ) {}

  findAll(): Promise<Movies[]> {
    return this.usersRepository.find();
  }

  async create(dto: Movies) {
    const newMovie = this.usersRepository.create(dto);
    await this.usersRepository.save(newMovie);
    return newMovie;
  }

  async delete(id: number) {
    const deleteResponse = await this.usersRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException("Post not found", HttpStatus.NOT_FOUND);
    }
  }
}
