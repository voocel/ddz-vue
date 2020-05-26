module.exports = {
  devServer: {
    host: 'localhost',
    port: 8080,
    progress: true,
    open: false
    // proxy: {
    //   '/socket.io': {
    //     target: 'http://192.168.10.20:3001',
    //     ws: true,
    //     changeOrigin: true
    //   },
    //   'sockjs-node': {
    //     target: 'http://192.168.10.20:3001',
    //     ws: false,
    //     changeOrigin: true
    //   }
    // }
  }
//   css: {
//     loaderOptions: {
//       sass: {
//         prependData: `@import "@/assets/styles/variables.scss";`
//       }
//     }
//   }
}
