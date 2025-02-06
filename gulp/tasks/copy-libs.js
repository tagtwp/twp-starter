import npmDist from 'gulp-npm-dist'

export const copyLibs = () => {
	return app.gulp
		.src(npmDist(), { base: app.paths.base.node })
			.pipe(app.gulp.dest(app.paths.base.libs))
}
