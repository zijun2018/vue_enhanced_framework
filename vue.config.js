/**
 *   @Project:   Vue配置文件 + 优化
 *   @Author:    Zi_Jun
 *   @Email:     zijun2030@gmail.com
 *   @Date:      2019/9/18 10:11
 *   @Note:      --
 */

const IS_PRODUCTION = process.env.Node_env === "production";

const cdn = {
  css: [],
  js: [
    "https://cdn.bootcss.com/vue/2.6.10/vue.runtime.min.js",
    "https://cdn.bootcss.com/vuex/3.1.1/vuex.min.js",
    "https://cdn.bootcss.com/vue-router/3.0.6/vue-router.min.js",
    "https://cdn.bootcss.com/axios/0.19.0/axios.min.js"
  ]
};

module.exports = {
  publicPath: "./",

  chainWebpack: config => {
    // 生产环境配置
    if (IS_PRODUCTION) {
      // 删除预加载
      config.plugins["delete"]("preload");
      config.plugins["delete"]("prefetch");

      // 代码压缩优化
      config.optimization.minimize(true);

      // 分割代码
      config.optimization.splitChunks({
        chunks: "all"
      });

      // 生产环境注入cdn
      config.plugin("html").tap(args => {
        args[0].cdn = cdn;
        return args;
      });
    }

    // 打包文件哈希化
    config.output.filename("[name].[hash].js").end();
  },

  configureWebpack: config => {
    if (IS_PRODUCTION) {
      // 采用用cdn方式引入
      config.externals = {
        vue: "Vue",
        vuex: "Vuex",
        "vue-router": "VueRouter",
        axios: "axios"
      };
    }
  },

  css: {
    // 不开启 CSS source maps
    sourceMap: false,

    // css预设器配置项
    loaderOptions: {
      // 设置全局样式
      sass: {
        data: `@import "@/styles/global/index.less";`
      }
    },

    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },

  lintOnSave: false,

  productionSourceMap: false,

  pwa: {
    iconPaths: {
      favicon32: "favicon.ico",
      favicon16: "favicon.ico",
      appleTouchIcon: "favicon.ico",
      maskIcon: "favicon.ico",
      msTileImage: "favicon.ico"
    }
  },

  devServer: {
    port: 8090, // 端口
    open: true, // 自动开启浏览器
    compress: false, // 开启压缩
    overlay: {
      warnings: true,
      errors: true
    }
  }
};
