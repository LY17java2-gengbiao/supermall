<template>
  <div>
    <child-detail :goods="categoryDetail"></child-detail>
  </div>
</template>

<script>
/**子组件 */
import ChildDetail from "./childDetail/ChildDetail";

export default {
  name: "CategoryTabDetail",
  components: {
    ChildDetail
  },
  props: {
    categoryDetail: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>

<style scoped>
</style>