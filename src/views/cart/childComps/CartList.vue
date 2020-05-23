<template>
  <div class="cart-list">
    <!--    <li v-for="item in cartList">{{item}}</li> -->
    <scroll class="content">
      <cart-list-item v-for="item in cartList" :item-info="item" />
    </scroll>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import Scroll from "components/common/scroll/Scroll";

import CartListItem from "./CartListItem";

export default {
  name: "CartList",
  components: {
    CartListItem,
    Scroll
  },
  computed: {
    /*  ...mapGetters(["cartList"]) */
    ...mapGetters({
      cartList: "cartList"
    })
  }
  /* activated() {
    this.$refs.scroll.refresh();
  } */
};
</script>

<style scoped>
.cart-list {
  height: calc(100% - 44px - 49px - 40px);
}
.content {
  height: 100%;
  overflow: hidden;
}
</style>