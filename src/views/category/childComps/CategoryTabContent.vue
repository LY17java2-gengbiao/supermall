<template>
  <grid-view :cols="3" :lineSpace="15" :v-margin="20" v-if="subcategories.list">
    <div class="item" v-for="(item, index) in subcategories.list" :key="index">
      <a :href="item.link">
        <img class="item-img" :src="item.image" alt @load="cImgLoad" />
        <div class="item-text">{{item.title}}</div>
      </a>
    </div>
  </grid-view>
</template>

<script>
/**公共组件 */
import GridView from "components/common/gridView/GridView";

export default {
  name: "CategoryTabContent",
  data() {
    return {
      isLoad: false
    };
  },
  components: {
    GridView
  },
  props: {
    subcategories: {
      type: Object,
      default() {
        return [];
      }
    }
  },
  methods: {
    cImgLoad() {
      if (!this.isLoad) {
        this.$emit("cImgLoad");
        this.isLoad = true;
      }
    }
  }
};
</script>

<style scoped>
.panel img {
  width: 100%;
}
.item {
  text-align: center;
  font-size: 12px;
}
.item-img {
  width: 80%;
}
.item-text {
  margin-top: 15px;
}
</style>