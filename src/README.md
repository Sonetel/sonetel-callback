# Introduction

The Sonetel Callback App is a progressive web app based on HTML, CSS and JavaScript. It uses NPM & Gulp for development.

## Prerequisites

- node 16+
- npm 8.5.5+

## Project Structure

- `src/` - contains all the source code.
- `public/` - contains the final code generated by Gulp. Only this folder should be served publicly by the web server.

# Get started

- Clone the repository.
```
$ git clone https://github.com/Sonetel/sonetel-callback.git
```
- Install the dependencies
```
$ npm install
```
- Generate the build
```
$ npx gulp
```
- Use a web server of your choice to host the files in the `public/` folder

## Development

For development, to ensure the site is updated when you make changes to the code, build it with the following command. 
```
$ npx gulp dev
```
This will update the files under the `public/` folder whenever you update the files in `src/`.

**Note:**

While releasing a new version of the app, the following points should be noted.

1. Increment the version number in `package.json`, `package.lock` and `src/js/app/const.js`
2. Change the cache version number in `src/js/service_worker.js`.