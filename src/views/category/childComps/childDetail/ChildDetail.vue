<template>
  <div class="goods">
    <child-detail-item v-for="item in goods" :goodsitem="item" />
  </div>
</template>

<script>
import ChildDetailItem from "./ChildDetailItem";

export default {
  name: "ChildDetail",
  components: {
    ChildDetailItem
  },
  props: {
    goods: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>

<style scoped>
.goods {
  /**flex布局,flex-wrap:wrap 不包裹  ,需要设置固定宽度=>子组件 */
  display: flex;
  flex-wrap: wrap;
  /**中间距离均等分两边距离是中间的2分之1 */
  justify-content: space-around;
  /**进行微调 */
  padding: 3px;
}
</style>