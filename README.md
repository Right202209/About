# About Me - Terminal Portfolio

A React-based terminal-style personal portfolio page. This is part of my homepage collection.

## Features
- **Terminal Interface**: Interactive command-line experience.
- **Static Commands**: Quick access to contact info, skills, and interests.
- **Dynamic Commands**: Interactive logic for introductions and opening external links.
- **Centralized Config**: All personal data is managed in `src/info.js` for easy updates.

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm start
```
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build
```bash
npm run build
```
Builds the app for production to the `build` folder.

### Deployment
```bash
npm run deploy
```
Deploys the production build to GitHub Pages.

## Project Structure
- `src/info.js`: **Central configuration file.** Edit this to change your name, email, skills, etc.
- `src/static.js`: Definitions for simple list-based commands.
- `src/dynamic.js`: Definitions for interactive commands (Promises/Callbacks).
- `src/App.js`: Main terminal component configuration.

## TODO List (Future Ideas)

### Functional Enhancements
- [ ] **`projects` command**: Detailed project showcase with tech stacks and descriptions.
- [ ] **GitHub Integration**: Fetch live stats (stars, repos) using GitHub API.
- [ ] **Blog Linkage**: Fetch and display latest posts from the Jekyll blog.
- [ ] **Timeline**: Add `education` and `experience` commands with a chronological view.

### Interactive Features
- [ ] **`theme` switching**: Support for different color schemes (Matrix, Retro, Dracula).
- [ ] **`sudo` easter egg**: Humorous responses for unauthorized sudo attempts.
- [ ] **`weather` command**: Display local weather based on IP.
- [ ] **Multi-language support**: Toggle between English and Chinese via `lang` command.

### Fun & Visuals
- [ ] **ASCII Art**: Large ASCII logo/name display on startup.
- [ ] **Mini-games**: Add classic games like `snake` or `guess-number`.
- [ ] **Matrix effect**: A full-screen digital rain animation command.

---
Built with [react-terminal-app](https://github.com/Tomotoes/react-terminal-app).
