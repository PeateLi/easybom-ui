module.exports = {
    lintOnSave: false,
	publicPath: './',     //解决打包上线时，文件路径变为绝对路径，显示空白
	configureWebpack: {       //对webpack配置
		devServer: {
			proxy: {        //跨域代理
				'/api': {
					target: 'http://ko.196.152.com',        //baseURL
					changeOrigin: true,               //是否开启跨域
					pathRewrite: {
						'^/api': ''          //让路径以/api开头的字段为空
					}
				}
			}
        },
        module: {
            rules: [
              { test: /\.txt$/, use: 'vue-markdown-loader' }
            ]
        },
    },
	pages: {
        index: {
          entry: 'examples/main.js',
          template: 'public/index.html',
          filename: 'index.html'
        }
    },
     // 扩展 webpack 配置，使 packages 加入编译
     chainWebpack: config => {
        config.module
          .rule('js')
          .include
            .add('/packages')
            .end()
          .use('babel')
            .loader('babel-loader')
            .tap(options => {
              // 修改它的选项...
              return options
            })
    }
}