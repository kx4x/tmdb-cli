#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const axios_1 = __importDefault(require("axios"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const dotenv_1 = __importDefault(require("dotenv"));
const figures_1 = __importDefault(require("figures"));
const terminal_image_1 = __importDefault(require("terminal-image"));
dotenv_1.default.config();
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const getMovies = async (type) => {
    const spinner = (0, ora_1.default)('Fetching movies...').start();
    try {
        const endpoints = {
            playing: '/movie/now_playing',
            popular: '/movie/popular',
            top: '/movie/top_rated',
            upcoming: '/movie/upcoming'
        };
        const response = await axios_1.default.get(`${BASE_URL}${endpoints[type]}`, {
            params: {
                api_key: API_KEY,
                language: 'en-US'
            }
        });
        spinner.succeed('Movies found!');
        console.log('\n' + chalk_1.default.bold.cyan('╔════════════════════════════════════╗'));
        console.log(chalk_1.default.bold.cyan('║           MOVIES LIST             ║'));
        console.log(chalk_1.default.bold.cyan('╚════════════════════════════════════╝\n'));
        for (const [index, movie] of response.data.results.entries()) {
            console.log(chalk_1.default.bold.magenta(`\n${index + 1}. ${movie.title.toUpperCase()}`), chalk_1.default.yellow(`\n   ${figures_1.default.star} Rating: ${movie.vote_average}/10`), chalk_1.default.blue(`\n   ${figures_1.default.pointer} Release Date: ${new Date(movie.release_date).toLocaleDateString('en-US')}`));
            if (movie.poster_path) {
                try {
                    const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                    const imageResponse = await axios_1.default.get(imageUrl, {
                        responseType: 'arraybuffer',
                        timeout: 10000
                    });
                    const imageBuffer = Buffer.from(imageResponse.data);
                    const renderedImage = await terminal_image_1.default.buffer(imageBuffer, {
                        width: '80%',
                        height: '60%',
                        preserveAspectRatio: true
                    });
                    console.log(renderedImage);
                }
                catch (error) {
                    console.log(chalk_1.default.red(`\n   ${figures_1.default.cross} Failed to load poster`));
                }
            }
            console.log(chalk_1.default.cyan(`\n   ${figures_1.default.info} Overview:`), chalk_1.default.white(`\n   ${movie.overview || 'Not available'}`), chalk_1.default.gray('\n   ' + '═'.repeat(50)));
        }
        console.log('\n' + chalk_1.default.bold.cyan('╔════════════════════════════════════╗'));
        console.log(chalk_1.default.bold.cyan('║           END OF LIST             ║'));
        console.log(chalk_1.default.bold.cyan('╚════════════════════════════════════╝\n'));
    }
    catch (error) {
        spinner.fail('Error fetching movies');
        if (error instanceof Error) {
            console.error(chalk_1.default.red(error.message));
        }
        process.exit(1);
    }
};
const program = new commander_1.Command();
program
    .version('1.0.0')
    .description('CLI to fetch movie information from TMDB')
    .option('-t, --type <type>', 'Type of movie list (playing/popular/top/upcoming)')
    .action((options) => {
    if (!options.type) {
        console.error(chalk_1.default.red('Please specify the list type using --type'));
        process.exit(1);
    }
    if (!['playing', 'popular', 'top', 'upcoming'].includes(options.type)) {
        console.error(chalk_1.default.red('Invalid type. Use: playing, popular, top or upcoming'));
        process.exit(1);
    }
    getMovies(options.type);
});
program.parse(process.argv);
