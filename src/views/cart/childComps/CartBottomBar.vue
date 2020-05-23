<template>
  <div class="bottom-bar">
    <div class="check-count">
      <check-button class="check-button" :is-checked="isSelectAll" @click.native="allClick" />
      <span>全选</span>
    </div>
    <div class="price">总计:{{totalPrice}}</div>
    <div class="calculate" @click="clacClick">去计算({{checkLength}})</div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton";

export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    //创建一个计算属性=>totalPrice
    totalPrice() {
      return (
        "¥" +
        this.$store.state.cartList
          .filter(item => {
            return item.checked;
          })
          .reduce((preValue, item) => {
            return preValue + item.price * item.count;
          }, 0)
          .toFixed(2)
      );
    },
    checkLength() {
      return this.$store.state.cartList.filter(item => item.checked).length;
    },
    isSelectAll() {
      if (this.$store.state.cartList.length === 0) return false;
      /*  return !this.$store.state.cartList.filter(item => !item.checked).length; */
      return !this.$store.state.cartList.find(item => !item.checked);
    }
  },
  methods: {
    allClick() {
      //第一种情况 : 全部选中的情况下,就让它全部不选中
      if (this.isSelectAll) {
        this.$store.state.cartList.forEach(item => (item.checked = false));
      } else {
        //第二种情况 : 有些选中了,有些没有选中,就让它全部选中
        this.$store.state.cartList.forEach(item => (item.checked = true));
      }
    },
    clacClick() {
      if (this.isSelectAll) {
        this.$toast.show("啦啦啦啦");
      } else if (!this.isSelectAll) {
        this.$toast.show("请选择购买的商品");
      } else {
        this.$toast.show("哈哈哈哈");
      }
    }
  }
};
</script>

<style scoped>
.bottom-bar {
  position: relative;
  display: flex;

  height: 40px;
  line-height: 40px;
  font-size: 14px;

  background-color: #eee;
}
.check-count {
  display: flex;
  align-items: center;
  margin-left: 10px;
  width: 60px;
}
.check-button {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 5px;
}
.price {
  margin-left: 30px;
  flex: 1;
}
.calculate {
  background-color: orangered;
  color: #fff;
  width: 100px;
  height: 44px;
  text-align: center;
  line-height: 44px;
  float: right;
}
</style>