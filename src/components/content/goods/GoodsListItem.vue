<template>
  <div class="goods-item" @click="itemClick">
    <img v-lazy="showImg" alt @load="itemImgLoad" />
    <div class="goods-info">
      <p>{{items.title}}</p>
      <span class="price">{{items.price}}</span>
      <span class="collect">{{items.cfav}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsListItem",
  props: {
    items: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    showImg() {
      return this.items.image || this.items.show.img;
    }
  },
  methods: {
    itemImgLoad() {
      this.$bus.$emit("loadMore");
    },
    itemClick() {
      this.$router.push("/detail/" + this.items.iid);
    }
  }
};
</script>

<style scoped>
.goods-item {
  padding-bottom: 40px;
  position: relative;
  width: 48%;
}
.goods-item img {
  width: 100%;
  border-radius: 5px;
  /* border: 3px solid var(--color-tint); */
}
.goods-info {
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}
.goods-info p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
}
.goods-info .price {
  color: var(--color-high-text);
  margin-right: 20px;
}
.goods-info .collect {
  position: relative;
}
.goods-info .collect::before {
  content: "";
  position: absolute;
  left: -15px;
  top: -1px;
  width: 14px;
  height: 14px;
  background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
}
</style>