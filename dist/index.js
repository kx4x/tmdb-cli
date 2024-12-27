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
const path_1 = __importDefault(require("path"));
const terminal_image_1 = __importDefault(require("terminal-image"));
// Carrega o .env do diretório atual
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
const API_KEY = process.env.TMDB_API_KEY;
// Verifica se a chave API existe
if (!API_KEY) {
    console.error(chalk_1.default.red('Error: TMDB_API_KEY not found in .env file'));
    process.exit(1);
}
const BASE_URL = 'https://api.themoviedb.org/3';
const getMovies = async (type) => {
    var _a, _b;
    const spinner = (0, ora_1.default)('Fetching movies...').start();
    try {
        const endpoints = {
            playing: '/movie/now_playing',
            popular: '/movie/popular',
            top: '/movie/top_rated',
            upcoming: '/movie/upcoming'
        };
        console.log('Debug - API Key:', API_KEY);
        console.log('Debug - URL:', `${BASE_URL}${endpoints[type]}`);
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
            console.log(chalk_1.default.bold.magenta(`\n${index + 1}. ${movie.title.toUpperCase()}`), chalk_1.default.yellow(`\n   ${figures_1.default.star} Rating: ${movie.vote_average}/10`), chalk_1.default.blue(`\n   ${figures_1.default.pointer} Release Date: ${new Date(movie.release_date).toLocaleDateString('en-US')}`), chalk_1.default.cyan(`\n   ${figures_1.default.info} Overview:`), chalk_1.default.white(`\n   ${movie.overview || 'Not available'}`), chalk_1.default.gray('\n   ' + '═'.repeat(50)));
            if (movie.poster_path) {
                try {
                    const imageUrl = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
                    const imageResponse = await axios_1.default.get(imageUrl, {
                        responseType: 'arraybuffer',
                        timeout: 10000
                    });
                    const imageBuffer = Buffer.from(imageResponse.data);
                    const renderedImage = await terminal_image_1.default.buffer(imageBuffer, {
                        width: '100%',
                        height: 45,
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
        if (axios_1.default.isAxiosError(error)) {
            const axiosError = error;
            console.error(chalk_1.default.red(`API Error: ${(_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.status} - ${(_b = axiosError.response) === null || _b === void 0 ? void 0 : _b.statusText}`));
            console.error(chalk_1.default.red(`Message: ${axiosError.message}`));
        }
        else if (error instanceof Error) {
            console.error(chalk_1.default.red(`Error: ${error.message}`));
        }
        else {
            console.error(chalk_1.default.red('An unknown error occurred'));
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
