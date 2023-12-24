const path = require('path')
const CraccoLessPlugin = require('craco-less')

export const resolve = (pathname: string) => path.resolve(__dirname, pathname)

module.exports = {
  // Whether or not TypeScript type checking is enabled.
  typescript: {
    enabelTypeChecking: true
  },
  // less
  plugins: [
    {
      plugin: CraccoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {},
            javascriptEnabled: true
          }
        }
      }
    }
  ],
  //  webpack中的配置项
  webpack: {
    // 配置别名
    alias: {
      '@': resolve('src'),
      comments: resolve('src/components')
    }
  }
}
