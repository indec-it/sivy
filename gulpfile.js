const gulp = require('gulp');
const plugins = require('gulp-load-plugins');
const $ = plugins();

gulp.task('eslint', () =>
    gulp.src(['**/*.js', '!node_modules/**', '!coverage/**', '!dist/**'])
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError())
);

gulp.task('mocha', () =>
    gulp.src('src/**/*.js')
        .pipe($.istanbul())
        .on('finish',
            () => gulp.src('test/**/*.test.js')
                .pipe($.mocha({reporter: 'spec'}))
                .pipe($.istanbul.writeReports())
                .on('error', process.exit.bind(process, 1))
                .on('end', process.exit.bind(process))
        )
);

gulp.task('test', ['eslint']);
