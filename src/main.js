import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//快速点击,解决移动端300ms延迟
import FastClick from 'fastclick'
//实现图片的懒加载
import VueLazyLoad from 'vue-lazyload'

//全局插件  ===>   toast
import toast from 'components/common/toast'

//声明一个事件总线
Vue.prototype.$bus = new Vue();
Vue.config.productionTip = false;
//安装toast插件  =====>  全局通用提示框
Vue.use(toast)
//解决移动端300ms的延迟
FastClick.attach(document.body)
//安装vue-lazyload插件
/* Vue.use(VueLazyLoad) */
Vue.use(VueLazyLoad, {
  loading: require('./assets/img/common/loading.png')
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
