# Disaster Ninja 2.0
[Description](https://www.kontur.io/portfolio/disaster-ninja/)

Run `npx husky-init` after you first time clone project

## How to use

The easiest way to use disaster-ninja front-end build is to use a docker image.
```
docker run --rm -d -p 80:80/tcp ghcr.io/konturio/disaster-ninja-fe:latest
```
after that it will be available on `http://localhost/active/` url

Another way is - use vite preview build
```
npm i
npm run build
npm run serve
```

## How to develop

For start dev server all you need is
```
npm i
npm run dev
```

## Available Scripts

### npm start

Runs the app in the development mode.
Open http://localhost:3000 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### npm test

Launches the test runner in the interactive watch mode.
See the section about running tests for more information.

### npm run build

Builds a static copy of your site to the `dist/` folder.

### npm run serve
Run static server for builded app

### typecheck and typecheck:watch
Check types error in project

### postinstall
Run this script after you run npm install
This will fix deck-gl types

### upgrade:kontur
Update @konturio to last versions

## Configuration
This app have few source of configuration:  

**Buildtime env variables**  
Need for store data that used in build time. This mostly internal glue stuff as env 'production' / 'development' variables, describe variables that rule build process (special build modes, hot reload, minification, mocks, etc.). Avoid to use it in src/* files.
- When used: At buildtime (node.js)
- How to set: use [.env](https://vitejs.dev/guide/env-and-mode.html#env-files) files
- How to read: `import.meta.env.VARIABLE_NAME`

**Runtime variables**  
Can be different for every environment.
Must describe - api endpoints, feature flags, base url, path to s3 with images, etc.
Available via AppConfig alias, in runtime in browser environment
They defined in JSON-per-enviroment files in `./configs/` folder.
You can your own for override default config, it should have name `./configs/config.local.json`

- When used: At runtime (browser)
- How to set: by configs in `./configs/`
- How to read: `import appConfig from '~core/app_config'`

> If you want use some build time variables in browser - re-export them from app_config