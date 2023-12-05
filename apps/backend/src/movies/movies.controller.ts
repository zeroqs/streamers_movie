import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { MoviesService } from "./movies.service";
import { Movies } from "./movies.interface";

@Controller("movies")
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Get()
  getAll(): Promise<Movies[]> {
    return this.moviesService.findAll();
  }

  @Post()
  create(@Body() movieCreateInterface: { url: string; name: string }) {
    return this.moviesService.create({
      ...movieCreateInterface,
    });
  }

  @Delete("/:id")
  async delete(@Param("id") id: string) {
    return this.moviesService.delete(Number(id));
  }
}
