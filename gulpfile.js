const { src, dest, watch, series } = require('gulp');

// CSS y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

// Imagenes
const squoosh = require('gulp-libsquoosh');
const avif = require("gulp-avif");

function css( done ) {
    src('src/scss/app.scss')
        .pipe( sourcemaps.init() )
        .pipe( sass() )
        .pipe( postcss([ autoprefixer(), cssnano() ]) )
        .pipe( sourcemaps.write('.'))
        .pipe( dest('build/css') )

    done();
}

function imagenes(done){
    src("src/img/**/*")
        .pipe(squoosh())
        .pipe(dest("build/img"));

    done();
};

function versionWebp(done) {
    src('src/img/**/*.{png,jpg}')
        .pipe( squoosh( {webp: {}} ))
        .pipe(dest('build/img'));

    done();
}

function versionAvif(done){
    const option = {quality: 50};
    src('src/img/**/*.{png,jpg}')
        .pipe( avif(option) )
        .pipe(dest('build/img'));
    
    done();
};

function dev() {
    watch( 'src/scss/**/*.scss', css );
    watch( 'src/img/**/*', imagenes );
}


exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series( imagenes, versionWebp, versionAvif, css, dev  );
