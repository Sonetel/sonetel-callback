// Load modules
const gulp = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const { src, series, parallel, dest, watch }  = require('gulp');


// path to the files to be processed
const appJsPath = 'src/js/app/**/*.js';
const srvJsPath = 'src/js/service_worker.js';
const cssPath = 'src/css/**/*.css';
const sitePath = 'src/site/**/**';

// Copy the HTML and other files

function copySite() {
    return src(sitePath).pipe(gulp.dest('public'));
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
    return watch([appJsPath, srvJsPath, sitePath, cssPath], { interval: 1000 }, parallel(copySite, cssTask, appJs, srvJs));
}


// Export the functions
exports.copySite = copySite;
exports.copyImg = copyImg;
exports.appJs = appJs;
exports.srvJs = srvJs;
exports.cssTask = cssTask;
exports.updateChanges = updateChanges;
exports.default = series(parallel(copySite, appJs, srvJs, cssTask, copyImg),updateChanges);
