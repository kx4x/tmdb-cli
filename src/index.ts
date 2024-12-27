#!/usr/bin/env node

import { Command } from 'commander';
import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import dotenv from 'dotenv';
import figures from 'figures';
import path from 'path';
import { Movie, TMDBResponse, MovieListType } from './types/tmdb';
import terminalImage from 'terminal-image';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const API_KEY = process.env.TMDB_API_KEY;

if (!API_KEY) {
  console.error(chalk.red('Error: TMDB_API_KEY not found in .env file'));
  process.exit(1);
}

const BASE_URL = 'https://api.themoviedb.org/3';

const getMovies = async (type: MovieListType): Promise<void> => {
  const spinner = ora('Fetching movies...').start();
  
  try {
    const endpoints: Record<MovieListType, string> = {
      playing: '/movie/now_playing',
      popular: '/movie/popular',
      top: '/movie/top_rated',
      upcoming: '/movie/upcoming'
    };

    const response = await axios.get<TMDBResponse>(`${BASE_URL}${endpoints[type]}`, {
      params: {
        api_key: API_KEY,
        language: 'en-US'
      }
    });

    spinner.succeed('Movies found!');

    console.log('\n' + chalk.bold.cyan('╔════════════════════════════════════╗'));
    console.log(chalk.bold.cyan('║           MOVIES LIST             ║'));
    console.log(chalk.bold.cyan('╚════════════════════════════════════╝\n'));

    for (const [index, movie] of response.data.results.entries()) {
      console.log(
        chalk.bold.magenta(`\n${index + 1}. ${movie.title.toUpperCase()}`),
        chalk.yellow(`\n   ${figures.star} Rating: ${movie.vote_average}/10`),
        chalk.blue(`\n   ${figures.pointer} Release Date: ${new Date(movie.release_date).toLocaleDateString('en-US')}`),
        chalk.cyan(`\n   ${figures.info} Overview:`),
        chalk.white(`\n   ${movie.overview || 'Not available'}`),
        chalk.gray('\n   ' + '═'.repeat(50))
      );

      if (movie.poster_path) {
        try {
          const imageUrl = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
          const imageResponse = await axios.get(imageUrl, { 
            responseType: 'arraybuffer',
            timeout: 10000
          });
          const imageBuffer = Buffer.from(imageResponse.data as ArrayBuffer);
          const renderedImage = await terminalImage.buffer(imageBuffer, {
            width: '100%',
            height: 45,
            preserveAspectRatio: true
          });
          console.log(renderedImage);
        } catch (error) {
          console.log(chalk.red(`\n   ${figures.cross} Failed to load poster`));
        }
      }

      console.log(
        chalk.cyan(`\n   ${figures.info} Overview:`),
        chalk.white(`\n   ${movie.overview || 'Not available'}`),
        chalk.gray('\n   ' + '═'.repeat(50))
      );
    }

    console.log('\n' + chalk.bold.cyan('╔════════════════════════════════════╗'));
    console.log(chalk.bold.cyan('║           END OF LIST             ║'));
    console.log(chalk.bold.cyan('╚════════════════════════════════════╝\n'));

  } catch (error: any) {
    spinner.fail('Error fetching movies');
    if (axios.isAxiosError(error)) {
      const axiosError = error;
      console.error(chalk.red(`API Error: ${axiosError.response?.status} - ${axiosError.response?.statusText}`));
      console.error(chalk.red(`Message: ${axiosError.message}`));
    } else if (error instanceof Error) {
      console.error(chalk.red(`Error: ${error.message}`));
    } else {
      console.error(chalk.red('An unknown error occurred'));
    }
    process.exit(1);
  }
};

const program = new Command();

program
  .version('1.0.0')
  .description('CLI to fetch movie information from TMDB')
  .option('-t, --type <type>', 'Type of movie list (playing/popular/top/upcoming)')
  .action((options: { type?: string }) => {
    if (!options.type) {
      console.error(chalk.red('Please specify the list type using --type'));
      process.exit(1);
    }

    if (!['playing', 'popular', 'top', 'upcoming'].includes(options.type)) {
      console.error(chalk.red('Invalid type. Use: playing, popular, top or upcoming'));
      process.exit(1);
    }

    getMovies(options.type as MovieListType);
  });

program.parse(process.argv);