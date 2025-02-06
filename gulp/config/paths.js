const srcFolder = './src'
const buildFolder = './app'
const libsFolder = './src/assets/libs'

export const paths = {
	base: {
		node: './node_modules',
		src: srcFolder,
		build: buildFolder,
		libs: libsFolder,
	},
	srcSvg: `${srcFolder}/img/svg/**.svg`,
	srcImgFolder: `${srcFolder}/img`,
	buildImgFolder: `${buildFolder}/img`,
	srcScss: `${srcFolder}/styles/**/*.scss`,
	buildCssFolder: `${buildFolder}/css`,
	srcFullJs: `${srcFolder}/js/**/*.js`,
	srcMainJs: `${srcFolder}/js/main.js`,
	buildJsFolder: `${buildFolder}/js`,
	srcTemplatesFolder: `${srcFolder}/templates`,
	assetsFolder: `${srcFolder}/assets`,
}
