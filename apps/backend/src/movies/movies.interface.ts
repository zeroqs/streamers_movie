import { VideoQuality } from "src/movies/moviesEntity/movieEntity";

export interface Movies {
	title: string;
	imageSrc: string;
}

export interface MoviesInterface extends Movies {
	qualities: VideoQuality[];
}
