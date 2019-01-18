const gulp = require('gulp'),
    uglify = require('gulp-uglify'), //压缩js
    htmlmin = require('gulp-htmlmin'), //压缩html

    imagemin = require('gulp-imagemin'), //压缩图片
    pngquant = require('imagemin-pngquant'), //深度压缩图片
    cache = require('gulp-cache'), //图片缓存，图片替换了才压缩

    // watch = require('gulp-watch'),
    changed = require('gulp-changed'), //只编译改动的文件
    less = require('gulp-less'), //less转css
    clearCss = require('gulp-clean-css'), //压缩css
    mincss = require('gulp-minify-css'),

    rename = require('gulp-rename'), //重命名文件
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'), // 发生异常，错误提示
    babel = require('gulp-babel'), //编译ES6代码

    autoprefixer = require('gulp-autoprefixer'), //加前缀
    concat = require("gulp-concat"), //文件合并
    del = require('del'), //删除文件

    browserSync = require('browser-sync').create(), //browser-sync开启静态服务器
    reload = browserSync.reload,
    runSequence = require('run-sequence'), //设定同步异步执行任务
    connect = require('gulp-connect'), //开启本地服务
    proxy = require('http-proxy-middleware'),
    browserify = require('gulp-browserify'),
    jsImport = require('gulp-js-import');

// less编译生成css(dev)
gulp.task('lessTask-dev', function () {
    return gulp.src(['./src/pages/less/*.less'])
        .pipe(plumber({
            errorHandler: notify.onError('Error:<%= error.message %>')
        }))
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 4 version']
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dev/pages/css'))
        .pipe(reload({
            stream: true
        }));
})
gulp.task('lessTask-dev-dialog', function () {
    return gulp.src('./src/dialog_page/**/*.less')
        .pipe(plumber({
            errorHandler: notify.onError('Error:<%= error.message %>')
        }))
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 4 version']
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dev/dialog_page'))
        .pipe(reload({
            stream: true
        }));
})
gulp.task('lessTask-dev-common', function () {
    return gulp.src(['./src/common/less/base.less', './src/common/less/validate.less'])
        .pipe(plumber({
            errorHandler: notify.onError('Error:<%= error.message %>')
        }))
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 4 version']
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dev/common/css'))
        .pipe(reload({
            stream: true
        }));
})

// 压缩css(production)
gulp.task('lessTask-production', ['lessTask-dev'], function () {
    return gulp.src('./dev/pages/**/*.css')
        .pipe(mincss())
        .pipe(gulp.dest('./build/pages/'));
})

gulp.task('lessTask-production-dialog', ['lessTask-dev-dialog'], function () {
    return gulp.src('./dev/dialog_page/**/*.css')
        .pipe(clearCss())
        .pipe(gulp.dest('./build/dialog_page'));
})
gulp.task('lessTask-production-common', ['lessTask-dev-common'], function () {
    return gulp.src('./dev/common/css/*.css')
        .pipe(clearCss())
        .pipe(gulp.dest('./build/common/css'));
})

// gulp.task('import', function() {
//   return gulp.src('./src/pages/**/*.js')
//         .pipe(jsImport({hideConsole: true}))
//         .pipe(gulp.dest('./dev/pages'));
// });

// 编译js(dev)
gulp.task('uglifyTask-dev', function () {
    return gulp.src('./src/pages/**/*.js')
        .pipe(plumber({
            errorHandler: notify.onError('Error:<%= error.message %>')
        }))
        .pipe(browserify())
        .pipe(gulp.dest('./dev/pages'))
        .pipe(reload({
            stream: true
        }));
})
gulp.task('uglifyTask-dialog', function () {
    return gulp.src('./src/dialog_page/**/*.js')
        .pipe(plumber({
            errorHandler: notify.onError('Error:<%= error.message %>')
        }))
        .pipe(browserify())
        .pipe(gulp.dest('./dev/dialog_page'))
        .pipe(reload({
            stream: true
        }));
})
gulp.task('uglifyTask-common', function () {
    return gulp.src('./src/common/js/*.js')
        .pipe(plumber({
            errorHandler: notify.onError('Error:<%= error.message %>')
        }))
        .pipe(browserify())
        .pipe(gulp.dest('./dev/common/js/'))
        .pipe(reload({
            stream: true
        }));
})

// 压缩js(production)
gulp.task('uglifyTask-production', ['uglifyTask-dev'], function () {
    return gulp.src('./dev/pages/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build/pages'))
})
gulp.task('uglifyTask-dialog-production', ['uglifyTask-dialog'], function () {
    return gulp.src('./dev/dialog_page/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build/dialog_page'))
})
gulp.task('uglifyTask-common-production', function () {
    return gulp.src('./src/common/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build/common/js/'))

})
// html(dev)
gulp.task('htmlTask-dev', function () {
    return gulp.src('src/pages/**/*.html')
        .pipe(gulp.dest('./dev/pages'))
        .pipe(reload({
            stream: true
        }));
})
gulp.task('htmlTask-dev-dialog', function () {
    return gulp.src('src/dialog_page/**/*.html')
        .pipe(gulp.dest('./dev/dialog_page'))
        .pipe(reload({
            stream: true
        }));
})

// 压缩html(production)
gulp.task('htmlTask-production', ['htmlTask-dev'], function () {
    return gulp.src('./dev/pages/**/*.html')
        .pipe(htmlmin())
        .pipe(gulp.dest('./build/pages'))
})
gulp.task('htmlTask-production-dialog', ['htmlTask-dev-dialog'], function () {
    return gulp.src('./dev/dialog_page/**/*.html')
        .pipe(htmlmin())
        .pipe(gulp.dest('./build/dialog_page'))
})

// 图片(dev)
gulp.task('imageTask-dev', function () {
    return gulp.src('src/images/*.{png,jpg,gif,ico}')
        .pipe(changed('./dev/images'))
        .pipe(gulp.dest('./dev/images'))
        .pipe(reload({
            stream: true
        }))
})

// 压缩img(production)
gulp.task('imageTask-production', ['imageTask-dev'], function () {
    return gulp.src('./dev/images/*.{png,jpg,gif,ico}')
        .pipe(cache(imagemin({
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('./build/images'))
})
gulp.task('imageTask-theme-production', function () {
    return gulp.src('./dev/pages/css/**/*.{png,jpg,gif,ico}')
        .pipe(cache(imagemin({
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('./build/pages/css'))
})

// 转移文件
gulp.task('moveFile-dev', function (cb) {
    gulp.src('./src/static/**/*')
        .pipe(gulp.dest('./dev/static'));
    gulp.src('./src/common/**/*.js')
        .pipe(gulp.dest('./dev/common'));
    gulp.src('./src/components/**/*')
        .pipe(gulp.dest('./dev/components'));
    gulp.src('./src/api/*')
        .pipe(gulp.dest('./dev/api'));
    gulp.src('./src/*.html')
        .pipe(gulp.dest('./dev/'));

})
gulp.task('moveFile-production', function () {
    gulp.src('./src/static/**/*')
        .pipe(gulp.dest('./build/static'));
    gulp.src('./src/common/**/*.js')
        .pipe(gulp.dest('./build/common'));
    gulp.src('./src/components/**/*')
        .pipe(gulp.dest('./build/components'));
    gulp.src('./src/api/*')
        .pipe(gulp.dest('./build/api'));
    gulp.src('./src/*.html')
        .pipe(gulp.dest('./build/'));
})

// 清空文件夹
gulp.task('clean-dev', (cb) => {
    return del(['./dev/**/*'], cb);
})

gulp.task('clean-build', (cb) => {
    return del(['./build/**/*'], cb);
})

gulp.task('dev', (cb) => {
    runSequence('clean-dev', 'htmlTask-dev', 'htmlTask-dev-dialog', ['lessTask-dev', 'lessTask-dev-common', 'lessTask-dev-dialog', 'uglifyTask-dialog', 'uglifyTask-dev', 'uglifyTask-common'], 'imageTask-dev', 'moveFile-dev');
    cb();
})

gulp.task('build', (cb) => {
    runSequence('clean-build', 'htmlTask-production', 'htmlTask-production-dialog', ['lessTask-production', 'lessTask-production-common', 'lessTask-production-dialog', 'uglifyTask-dialog-production', 'uglifyTask-production', 'uglifyTask-common-production'], 'imageTask-theme-production', 'imageTask-production', 'moveFile-production');
})


// 测试执行
gulp.task('run', () => {
    browserSync.init({ // 启动Browsersync服务
        server: {
            baseDir: './dev', // 启动服务的目录 默认 index.html
            middleware: [ //代理服务器
                proxy('/api', {
                    target: 'http://119.23.109.99:8080',
                    changeOrigin: true
                }),
            ]
        },
        open: 'external', // 决定Browsersync启动时自动打开的网址 external 表示 可外部打开 url, 可以在同一 wifi 下不同终端测试
        injectChanges: true, // 注入CSS改变
        notify: false,
        port: 9090,
    }
        // ,function (err, bs) {
        //     bs.addMiddleware("*", (req, res) => {
        //         // Provides the 404 content without redirect.
        //         res.writeHead(302, {
        //             location: "http://172.17.4.162:9000/404.html"
        //         });
        //         res.end();
        //     });
        // }
    );

    // 监听文件变化，执行相应任务
    gulp.watch('./src/pages/**/*.less', ['lessTask-dev']);
    gulp.watch('./src/dialog_page/**/*.less', ['lessTask-dev-dialog']);
    gulp.watch('./src/common/**/*.less', ['lessTask-dev-common']);
    gulp.watch('./src/common/js/*.js', ['moveFile-dev']);
    gulp.watch('./src/pages/**/*.js', ['uglifyTask-dev']);
    gulp.watch('./src/dialog_page/**/*.js', ['uglifyTask-dialog']);
    gulp.watch('./src/images/*.{png,jpg,gif,ico}', ['imageTask-dev']);
    // gulp.watch('./src/common/**/*.{png,jpg,gif,ico}', ['imageTask-theme-dev']);
    gulp.watch('./src/dialog_page/**/*.html', ['htmlTask-dev-dialog']).on('change', reload);
    gulp.watch('./src/pages/**/*.html', ['htmlTask-dev']).on('change', reload);
    gulp.watch('./src/*.html', function () {
        gulp.src('./src/*.html')
            .pipe(gulp.dest('./dev/'));
    }).on('change', reload);

    gulp.watch('./src/components/**/*.js', ['uglifyTask-dev']);
    gulp.watch('./src/components/**/*.less', ['lessTask-dev']);
    gulp.watch('./src/components/**/*.html', ['htmlTask-dev']).on('change', reload);
    gulp.watch('./src/*.html', ['htmlTask-dev']).on('change', reload);

})