import colors from 'vuetify/es5/util/colors';
import myRouters from './config/router';
import myHead from './config/head';

export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: myHead,
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~/assets/style.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/axios',
    '~/plugins/dateTimePicker',
    '~/plugins/moment',
    '~/plugins/pdfMake',
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },

        light: {
          primary: colors.blue,
          accent: colors.grey,
          secondary: colors.amber,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.darken3,
        },
      },
    },
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */

    extend(config, { isClient }) {
      if (isClient) {
        config.optimization.splitChunks = {
          chunks: 'initial',
          minSize: 10000,
          maxSize: 20000,
          cacheGroups: {
            default: false, // disable the built-in groups, default & vendors (vendors is overwritten below)
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              enforce: true,
            },
          },
        };
      }
    },
  },
  router: {
    base: '/',
    mode: 'history',
    middleware: [],
    extendRoutes(routes, resolve) {
      routes.splice(
        0,
        routes.length,
        ...myRouters.map(route => ({
          ...route,
          component: resolve(__dirname, route.component),
        }))
      );
    },
  },
};
