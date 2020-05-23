<template>
  <div class="tab-control">
    <div class="tab-control-item" v-for="(item,index) in titles" @click="IndexClick(index)">
      <span :class="{active:index===currentIndex}">{{item}}</span>
      <!-- :class="{active:index === currentIndex}" -->
    </div>
  </div>
</template>

<script>
export default {
  name: "TabControl",
  props: {
    titles: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      currentIndex: 0
    };
  },
  methods: {
    IndexClick(index) {
      this.currentIndex = index;
      console.log(index);
      this.$emit("tabIndex", index);
    }
  }
};
</script>

<style scoped>
.tab-control {
  display: flex;
  text-align: center;
  font-size: 16px;
  height: 40px;
  line-height: 40px;
  background-color: #fff;
}
.tab-control-item {
  flex: 1;
}
.tab-control-item span {
  padding: 5px;
}
.active {
  border-bottom: 2px solid var(--color-tint);
  color: var(--color-high-text);
}
</style>