# About Anweshane - 2K26

Official college fest website for Bahubali College of Engineering.

This project includes:

- `index.html` - home / fest landing page
- `events.html` - events and registration page
- shared styles in `css/`
- interaction scripts in `js/`

## Requirements

- Node.js 18 or later
- npm

## Run Locally

1. Clone the repository:

```bash
git clone https://github.com/yash359am/Collage-Event-Registration-Site.git
cd Collage-Event-Registration-Site
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the local site in your browser:

- Home page: `http://127.0.0.1:5173/`
- Events page: `http://127.0.0.1:5173/events.html`

If Vite uses a different port, check the terminal output and open the URL shown there.

## Production Build

Create an optimized production build:

```bash
npm run build
```

The generated files will be available in the `dist/` folder.

## Preview The Production Build

Run the production preview server:

```bash
npm run preview
```

Then open the preview URL shown in the terminal.

## Project Structure

```text
.
|-- index.html
|-- events.html
|-- css/
|-- js/
|-- images/
|-- package.json
`-- vite.config.js
```

## Notes

- The project uses Vite for local development and production builds.
- Some event assets, sports artwork, and video backgrounds are stored in the `images/` folder.
- Registration links and event content are maintained directly in the HTML/JS files.
