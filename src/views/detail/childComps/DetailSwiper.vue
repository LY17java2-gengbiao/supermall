<template>
  <swiper class="swipers">
    <swiper-item v-for="item in rotation">
      <img :src="item" alt />
    </swiper-item>
  </swiper>
</template>

<script>
//公共组件
import { Swiper, SwiperItem } from "components/common/swiper";
export default {
  name: "DetailSwiper",
  components: {
    Swiper,
    SwiperItem
  },
  props: {
    rotation: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>

<style scoped>
.swipers {
  height: 300px;
  overflow: hidden;
}
</style>