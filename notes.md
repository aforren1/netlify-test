(these are a one-time thing)

1. Install netlify-cli (`npm install netlify-cli -g`)
2. Authenticate (`netlify login`)

(these are once per site)

3. Create git repo, add github remote (public or private)
4. `netlify init` and follow the prompts

- build command will be `npm run build`, deploy dir will be `dist`? Can ignore the prompt for now, will be set in `netlify.toml` file.

5. Install dependencies with `npm install` (and go get lunch)
6. Make sure `node_modules` and `dist` are in the gitignore!

Secrets (API keys) live in the Netlify UI

- Go to https://app.netlify.com, click on the site, settings->Build & Deploy->Environment
- Access via `process.env.<SECRET_NAME>`

To build locally:

`netlify build`

To run locally:

`netlify dev`

Note that mailgun-js is installed from GitHub, which resolves some security issues in dependencies (0.22.0 is on npm, but without those fixes).

clearer delineation between trials
bouncing keyboard
tending toward longer blocks-- can we get a lower-freq "implicit"
