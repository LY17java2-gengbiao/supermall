<template>
  <!-- 先创建一个根,起个id -->
  <div id="hy-swiper">
    <!--
         touchstart:触摸开始
         touchmove:滑动时
         touchend:触摸结束时
    -->
    <div class="swiper" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
      <slot></slot>
    </div>
    <slot name="indicator"></slot>
    <div class="indicator">
      <!-- v-if 如果显示红点,并且当前元素个数大于1 就显示 -->
      <slot name="indicator" v-if="showIndicator && slideCount>1">
        <div
          v-for="(item, index) in slideCount"
          class="indi-item"
          :class="{active: index === currentIndex-1}"
          :key="index"
        ></div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Swiper",
  props: {
    interval: {
      type: Number,
      default: 3000
    },
    animDuration: {
      type: Number,
      default: 300
    },
    //设置比例,滑动比例,大于25%就让它划过去
    moveRatio: {
      type: Number,
      default: 0.25
    },
    //显示红点
    showIndicator: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      slideCount: 0, // 元素个数
      totalWidth: 0, // swiper的宽度
      swiperStyle: {}, // swiper样式
      currentIndex: 1, // 当前的index
      scrolling: false // 是否正在滚动
    };
  },
  //生命周期 mounted:挂载结束状态
  mounted: function() {
    // 1.操作DOM, 在前后添加Slide
    setTimeout(() => {
      this.handleDom();

      // 2.开启定时器
      this.startTimer();
    }, 200);
  },
  methods: {
    /**
     * 定时器操作
     * 开始定时器
     */
    startTimer: function() {
      this.playTimer = window.setInterval(() => {
        this.currentIndex++;
        this.scrollContent(-this.currentIndex * this.totalWidth);
      }, this.interval);
    },
    /**
     * 关闭定时器
     */
    stopTimer: function() {
      window.clearInterval(this.playTimer);
    },

    /**
     * 设置滚动动画
     * 滚动到正确的位置
     */
    scrollContent: function(currentPosition) {
      // 0.设置正在滚动
      this.scrolling = true;

      // 1.开始滚动动画
      this.swiperStyle.transition = "transform " + this.animDuration + "ms";
      this.setTransform(currentPosition);

      // 2.判断滚动到的位置
      this.checkPosition();

      // 4.滚动完成
      this.scrolling = false;
    },

    /**
     * 校验正确的位置
     */
    checkPosition: function() {
      window.setTimeout(() => {
        // 1.校验正确的位置
        this.swiperStyle.transition = "0ms";
        /*1.1 currentIndex=>当前的index,
            slideCount=>元素个数
            如果当前的index大于等于元素个数+1
            那么当前index=1
            setTransform=>重置并创建新的变换矩阵，再次绘制矩形
        */
        if (this.currentIndex >= this.slideCount + 1) {
          this.currentIndex = 1;
          this.setTransform(-this.currentIndex * this.totalWidth);
        } else if (this.currentIndex <= 0) {
          /**
           * 1.2 如果当前index小于或者等于0
           *    那么当前index等于元素个数
           */
          this.currentIndex = this.slideCount;
          this.setTransform(-this.currentIndex * this.totalWidth);
        }

        // 2.结束移动后的回调
        this.$emit("transitionEnd", this.currentIndex - 1);
      }, this.animDuration);
    },

    /**
     * 设置滚动的位置
     */
    setTransform: function(position) {
      this.swiperStyle.transform = `translate3d(${position}px, 0, 0)`;
      this.swiperStyle[
        "-webkit-transform"
      ] = `translate3d(${position}px), 0, 0`;
      this.swiperStyle["-ms-transform"] = `translate3d(${position}px), 0, 0`;
    },

    /**
     * 操作DOM, 在DOM前后添加Slide
     */
    handleDom: function() {
      // 1.获取要操作的元素
      //1.1获取class为swiper的元素内容,并复制给swiperEl
      let swiperEl = document.querySelector(".swiper");
      /*1.2 getElementsByClassName方法返回文档中所有
      指定类名的元素集合，作为 NodeList 对象。可以看做一个list集合*/
      let slidesEls = swiperEl.getElementsByClassName("slide");

      // 2.保存个数
      this.slideCount = slidesEls.length;

      // 3.如果大于1个, 那么在前后分别添加一个slide
      if (this.slideCount > 1) {
        //cloneNode() 方法拷贝所有属性和值   可创建指定的节点的精确拷贝
        //3.1 声明一个cloneFirst 将slidesEls集合中的第一个复制给cloneFirst
        let cloneFirst = slidesEls[0].cloneNode(true);
        //3.2 声明一个cloneLast 将slidesEls集合中最后一个复制给cloneLast
        let cloneLast = slidesEls[this.slideCount - 1].cloneNode(true);
        //3.3 insertBefore() 方法可在已有的子节点前插入一个新的子节点。
        swiperEl.insertBefore(cloneLast, slidesEls[0]);
        //3.4 appendChild() 方法可向节点的子节点列表的末尾添加新的子节点。
        swiperEl.appendChild(cloneFirst);
        /*3.5 totalWidth是swiper的宽度,
              offsetWidth是盒子最终的宽
              将swiperEl的offsetWidth赋值给totalWidth*/
        this.totalWidth = swiperEl.offsetWidth;
        /*3.6 swiperStyle => swiperStyle的样式
          将swiperEl的样式复制给swiperStyle*/
        this.swiperStyle = swiperEl.style;
      }

      // 4.让swiper元素, 显示第一个(目前是显示前面添加的最后一个元素)
      this.setTransform(-this.totalWidth);
    },

    /**
     * 拖动事件的处理
     * touchstart:触摸开始
     */
    touchStart: function(e) {
      // 1.如果正在滚动, 不可以拖动
      //scrolling =>是否正在滚动
      if (this.scrolling) return;

      // 2.停止定时器,拖动过程中,需要停止定时器
      this.stopTimer();

      // 3.保存开始滚动的位置,保留触点坐标
      this.startX = e.touches[0].pageX;
    },

    /**
     *  touchmove:滑动时
     */
    touchMove: function(e) {
      // 1.计算出用户拖动的距离,将触点坐标赋值给this.currentX
      this.currentX = e.touches[0].pageX;
      //2.用起始坐标值减去结束的坐标值保存给this.distance
      this.distance = this.currentX - this.startX;
      //3.声明一个currentPosition,获取当前index*swiper的宽度的值,并赋值给currentPosition
      let currentPosition = -this.currentIndex * this.totalWidth;
      //4.将this.distance+currentPosition的值赋值给moveDistance
      let moveDistance = this.distance + currentPosition;

      // 5.设置当前的位置
      this.setTransform(moveDistance);
    },
    /**
     * touchend:触摸结束时
     */
    touchEnd: function(e) {
      // 1.获取移动的距离
      //abs() 方法可返回数的绝对值。
      //this.distance是移动了多少的坐标值,也就是移动距离坐标值
      let currentMove = Math.abs(this.distance);

      // 2.判断最终的距离
      //2.1如果this.distance等于0,那么返回空
      if (this.distance === 0) {
        return;
      } else if (
        //2.2如果this.distance大于0并且
        //移动距离大于swiper的宽度*传过来的滑动值
        this.distance > 0 &&
        currentMove > this.totalWidth * this.moveRatio
      ) {
        //2.3 向右边移动超过0.5,当前index--
        this.currentIndex--;
      } else if (
        //2.4如果this.distance小于0
        this.distance < 0 &&
        currentMove > this.totalWidth * this.moveRatio
      ) {
        //2.5 向左边移动超过0.5.当前index++
        this.currentIndex++;
      }

      // 3.移动到正确的位置
      //scrollContent:滚动动画
      this.scrollContent(-this.currentIndex * this.totalWidth);

      // 4.移动完成后重新开启定时器
      this.startTimer();
    },

    /**
     * 控制上一个, 下一个
     */
    previous: function() {
      //调用changItem方法,传一个-1
      this.changeItem(-1);
    },

    next: function() {
      //调用changeItem方法,传一个1
      this.changeItem(1);
    },

    changeItem: function(num) {
      // 1.移除定时器
      this.stopTimer();

      // 2.修改index和位置
      this.currentIndex += num;
      this.scrollContent(-this.currentIndex * this.totalWidth);

      // 3.添加定时器
      this.startTimer();
    }
  }
};
</script>

<style scoped>
#hy-swiper {
  overflow: hidden;
  position: relative;
}

.swiper {
  display: flex;
}

.indicator {
  display: flex;
  justify-content: center;
  position: absolute;
  width: 100%;
  bottom: 8px;
}

.indi-item {
  box-sizing: border-box;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #fff;
  line-height: 8px;
  text-align: center;
  font-size: 12px;
  margin: 0 5px;
}

.indi-item.active {
  background-color: rgba(212, 62, 46, 1);
}
</style>
