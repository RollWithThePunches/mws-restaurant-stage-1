const gulp = require('gulp');
const eslint = require('gulp-eslint');
const connect = require('gulp-connect');
const concat = require('gulp-concat');
const jasmine = require('gulp-jasmine-phantom');
const babelify = require('babelify');
const browserSync = require('browser-sync').create();

gulp.task('connect', () => {
	connect.server();
});

gulp.task('default', ['connect', 'eslint'], () => {
	gulp.watch('js/**/*.js', ['eslint']);
	browserSync.init({
		server: './'
	});
});

/*gulp.task('default', ['connect', 'copy-html'], (done) => {
	gulp.watch('/index.html', ['copy-html']);
	gulp.watch('.build/index.html')
		.on('change', browserSync,reload);
});*/

gulp.task('eslint', () => {
	return gulp.src(['scripts/*.js'])
    	// eslint() attaches the lint output to the "eslint" property
    	// of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
    });



gulp.task('scripts', () => {
	gulp.src('js/**/*.js')
		.pipe(babelify())
		.pipe(concat('all.js'));
});

gulp.task('tests', () => {
	gulp.src('js/dbhelper.js')
		.pipe(jasmine({
			integration: true,
			vendor: 'js/**/*.js'
		}));
});

browserSync.stream();

