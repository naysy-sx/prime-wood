import gulp from 'gulp';
import pug from 'gulp-pug';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cleanCSS from 'gulp-clean-css';
import concat from 'gulp-concat';
import terser from 'gulp-terser';
import browserSync from 'browser-sync';
import { deleteAsync } from 'del';
import rename from 'gulp-rename';
import newer from 'gulp-newer';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import imagemin from 'gulp-imagemin';

const sass = gulpSass(dartSass);
const server = browserSync.create();

// Пути
const paths = {
  src: {
    pug: './src/pug/**/*.pug',
    css: './src/css/**/*.css',
    scss: './src/scss/**/*.scss',
    js: './src/js/**/*.js',
    fonts: './src/fonts/**/*',
    images: './src/images/**/*.{png,jpg,jpeg,gif,svg}'
  },
  dist: {
    html: './dist/',
    css: './dist/static/css/',
    js: './dist/static/js/',
    fonts: './dist/static/fonts/',
    images: './dist/static/images/'
  },
  watch: {
    pug: './src/pug/**/*.pug',
    css: './src/css/**/*.css',
    scss: './src/scss/**/*.scss',
    js: './src/js/**/*.js',
    images: './src/images/**/*.{png,jpg,jpeg,gif,svg}'
  },
  clean: './dist'
};

// Очистка директории dist
export function clean() {
  return deleteAsync(paths.clean);
}

// Компиляция Pug в HTML
export function html() {
  return gulp.src(paths.src.pug)
    .pipe(plumber({ errorHandler: notify.onError("Ошибка в Pug: <%= error.message %>") }))
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(paths.dist.html))
    .pipe(server.stream());
}

// Обработка CSS-файлов
export function cssVendor() {
  return gulp.src([
    './src/css/aos.css',
    './src/css/fancybox.css', 
    './src/css/reset.css',
    './src/css/swiper-bundle.min.css'
  ])
    .pipe(plumber({ errorHandler: notify.onError("Ошибка в CSS: <%= error.message %>") }))
    .pipe(postcss([autoprefixer()]))
    .pipe(concat('vendor.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.dist.css))
    .pipe(server.stream());
}

// Компиляция SCSS в CSS
export function scss() {
  return gulp.src(paths.src.scss)
    .pipe(plumber({ errorHandler: notify.onError("Ошибка в SCSS: <%= error.message %>") }))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.dist.css))
    .pipe(server.stream());
}

// Обработка JavaScript
export function js() {
  const vendorJs = gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    './src/js/aos.js',
    './src/js/fancybox.umd.js',
    './src/js/imask.js',
    './src/js/swiper-bundle.min.js'
  ])
    .pipe(plumber({ errorHandler: notify.onError("Ошибка в JS вендорах: <%= error.message %>") }))
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest(paths.dist.js))
    .pipe(server.stream());

  // Собственные скрипты
  const mainJs = gulp.src('./src/js/main.js')
    .pipe(plumber({ errorHandler: notify.onError("Ошибка в JS: <%= error.message %>") }))
    .pipe(concat('main.min.js'))
    .pipe(terser())
    .pipe(gulp.dest(paths.dist.js))
    .pipe(server.stream());

  return Promise.all([vendorJs, mainJs]);
}

// Копирование шрифтов
export function fonts() {
  return gulp.src(paths.src.fonts)
    .pipe(gulp.dest(paths.dist.fonts));
}

// Обработка изображений
export function images() {
  return gulp.src(paths.src.images)
    .pipe(plumber({ errorHandler: notify.onError("Ошибка в обработке изображений: <%= error.message %>") }))
    .pipe(newer(paths.dist.images))
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist.images));
}

// Локальный сервер и отслеживание изменений
export function serve() {
  server.init({ server: { baseDir: './dist' }, open: false });

  gulp.watch(paths.watch.pug, html);
  gulp.watch(paths.watch.css, cssVendor);
  gulp.watch(paths.watch.scss, scss);
  gulp.watch(paths.watch.js, js);
  gulp.watch(paths.watch.images, images);
}

// Сборка проекта
export const build = gulp.series(clean, gulp.parallel(html, cssVendor, scss, js, fonts, images));
export const dev = gulp.series(build, serve);

// Экспорт по умолчанию
export default dev;
