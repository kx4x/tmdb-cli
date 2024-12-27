# TMDB CLI

A command-line tool to fetch movie information from The Movie Database (TMDB).

> This project is based on the requirements from [roadmap.sh/projects/tmdb-cli](https://roadmap.sh/projects/tmdb-cli)

## 📋 Prerequisites

- Node.js (version 14 or higher)
- NPM (Node Package Manager)
- A TMDB API key

## 🚀 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kx4x/tmdb-cli.git
   cd tmdb-cli
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your API key:
   - Create a `.env` file in the project root
   - Add your API key: `TMDB_API_KEY=your_key_here`

4. Build the project:
   ```bash
   npm run build
   ```

5. Install globally (optional):
   ```bash
   npm install -g .
   ```

## 🎯 How to Use

## 🔧 Available Options

- `playing`: Shows movies currently in theaters
- `popular`: Lists the most popular movies
- `top`: Displays the highest-rated movies
- `upcoming`: Shows upcoming releases

## 🛠️ Technologies Used

- TypeScript
- Node.js
- Commander.js (for CLI)
- Axios (for HTTP requests)
- Chalk (for colored output)
- Ora (for loading spinners)

## 📝 Available Scripts

- `npm run build`: Compiles the TypeScript project
- `npm run start`: Runs the compiled version
- `npm run dev`: Runs directly with ts-node

## 📄 License

This project is licensed under the ISC License. See the `LICENSE` file for details.

## 🎯 Next Steps

- [ ] Add pagination
- [ ] Implement specific movie search
- [ ] Add more details about each movie
- [ ] Implement results caching
- [ ] Add unit tests
- [ ] Improve output formatting

## ✨ Author

kx4x - [github.com/kx4x]

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the API
- All contributors and maintainers of the libraries used
