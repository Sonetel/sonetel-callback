// Load modules
const gulp = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const htmlMinify = require('html-minifier');
const { src, series, parallel, dest, watch }  = require('gulp');

// HTML Minifier options
const htmlMinifyOptions = {
    includeAutoGeneratedTags: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortClassName: true,
    useShortDoctype: true,
    collapseWhitespace: true
  };


// path to the files to be processed
const appJsPath = 'src/js/app/**/*.js';
const srvJsPath = 'src/js/service_worker.js';
const cssPath = 'src/css/**/*.css';
const manifestPath = 'src/site/manifest.json';
const htmlPath = 'src/site/**/**.html';

// Copy the HTML and other files

function copyManifest() {
    return src(manifestPath).pipe(gulp.dest('public'));
}

function copyHtml() {
    return src(htmlPath)
    .on('data', function(file) {
        const buferFile = Buffer.from(htmlMinify.minify(file.contents.toString(), htmlMinifyOptions))
        return file.contents = buferFile
    })
    .pipe(gulp.dest('public'));
}

// Copy the images
function copyImg() {
    return src('src/images/**/**').pipe(gulp.dest('public/images'));
}

// process the css files

function cssTask() {
    return src(cssPath)
    .pipe(sourcemaps.init())
    .pipe(concat('sonetel.css'))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('public/assets/css'))
}

// Main JS for the app containing all the logic
function appJs() {
    return src(appJsPath)
    .pipe(sourcemaps.init())
    .pipe(concat('index.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('public/assets/js'))
}

// Service Worker to handle the PWA aspect
function srvJs() {
    return src(srvJsPath)
    .pipe(sourcemaps.init())
    .pipe(concat('service_worker.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('public/assets/js'))
}

// Watch task to automatically update the files during development
function updateChanges() {
    return watch([appJsPath, srvJsPath, htmlPath, cssPath], { interval: 1000 }, parallel(copyHtml ,srvJs, cssTask, appJs));
}


// Export the functions
exports.copyManifest = copyManifest;
exports.copyHtml = copyHtml;
exports.copyImg = copyImg;
exports.appJs = appJs;
exports.srvJs = srvJs;
exports.cssTask = cssTask;
exports.updateChanges = updateChanges;
exports.dev = series(parallel(copyManifest, appJs, srvJs, cssTask, copyImg), copyHtml, updateChanges);
exports.default = series(parallel(copyManifest, appJs, srvJs, cssTask, copyImg), copyHtml);
