<template>
  <div class="cart">
    <!--导航-->
    <nav-bar class="cart-nav">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>
    <!--商品的列表-->
    <cart-list />
    <!--底部汇总-->
    <cart-bottom-bar />
  </div>
</template>

<script>
//公共组件-common
import NavBar from "components/common/navbar/NavBar";

//框架自带辅助函数
import { mapGetters } from "vuex";
//子组件
import CartList from "./childComps/CartList";
import CartBottomBar from "./childComps/CartBottomBar";

export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    CartBottomBar
  },
  data() {
    return {};
  },
  computed: {
    //有两种用法,
    //第一种,数组格式,使用时,名字需要如数组中的名字保持一致
    /*  ...mapGetters(["cartLength"]) */
    //第二种,对象格式,可以在对象中给getters里的方法名起别名,这样就只能使用别名引用
    ...mapGetters({
      length: "cartLength"
    })
  }
};
</script>

<style scoped>
.cart {
  height: 100vh;
}
.cart-nav {
  color: #fff;
  background-color: var(--color-tint);
}
</style>