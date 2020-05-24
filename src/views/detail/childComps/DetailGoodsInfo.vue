<template>
  <!-- 如果detailInfo的长度是0就不进行渲染-->
  <div v-if="Object.keys(detailInfo).length !== 0" class="goods-info">
    <div class="info-desc clear-fix">
      <div class="start"></div>
      <!-- 描述内容-->
      <div class="desc">{{detailInfo.desc}}</div>
      <div class="end"></div>
    </div>
    <!--简短介绍===> 例子:  穿着效果-->
    <div class="info-key">{{detailInfo.detailImage[0].key}}</div>
    <div class="info-list">
      <!--一堆图片-->
      <img v-for="(item, index) in detailInfo.detailImage[0].list" :src="item" alt @load="LoadMore" />
    </div>
  </div>
</template>

<script>
export default {
  name: "DetailGoodsInfo",
  props: {
    detailInfo: {
      type: Object
    }
  },
  data() {
    return {
      counter: 0,
      imagessLength: 0
    };
  },
  methods: {
    /* 第一种方法 通过bus发送
    LoadMore() {
      this.$bus.$emit('detafilImg')
    } */

    //第二种通过父子组件通信
    LoadMore() {
      //判断,所有图片都加载完了,那么进行一次回调就可以了
      //++:先加再对比;this.counter+=1
      //加上判断是关注性能,去掉判断是关注图片加载速度
      if (++this.counter === this.imagessLength) {
        this.$emit("imgLoad");
      }
    }
  },
  watch: {
    //通过watch监听对象的变化
    //获取图片的个数
    detailInfo() {
      this.imagessLength = this.detailInfo.detailImage[0].list.length;
    }
  }
};
</script>

<style scoped>
.goods-info {
  padding: 20px 0;
  border-bottom: 5px solid #f2f5f8;
}
.info-desc {
  padding: 0 15px;
}
.info-desc .start,
.info-desc .end {
  width: 90px;
  height: 1px;
  background-color: #a3a3a5;
  position: relative;
}
.info-desc .start {
  float: left;
}
.info-desc .end {
  float: right;
}
.info-desc .start::before,
.info-desc .end::after {
  content: "";
  position: absolute;
  width: 5px;
  height: 5px;
  background-color: #333;
  bottom: 0;
}
.info-desc .end::after {
  right: 0;
}
.info-desc .desc {
  padding: 15px 0;
  font-size: 14px;
}
.info-key {
  margin: 10px 0 10px 15px;
  color: #333;
  font-size: 15px;
}
.info-list img {
  width: 100%;
}
</style>