<template>
  <div id="home">
    <!--导航栏 -->
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control
      class="tab-control"
      :titles="['流行','新款','精选']"
      @tabIndex="tabIndex"
      ref="tabControl1"
      v-show="isTab1"
    />
    <!--better-scroll-->
    <scroll
      class="content"
      ref="scroll"
      :probeType="3"
      @scroll="constScroll"
      :pullUpLoad="true"
      @pullingUp="Loadbottom"
    >
      <!--轮播图-->
      <home-swiper :banner="banner" @swiperImgLoad="swiperImgLoad" />

      <!--横向图片链接-->
      <home-recommend :recommend="recommend"></home-recommend>

      <!--一张大图片-->
      <home-picture />
      <tab-control
        class="tab-control"
        :titles="['流行','新款','精选']"
        @tabIndex="tabIndex"
        ref="tabControl2"
      />
      <goods-list :goods="showGoods" />
    </scroll>
    <back-top v-show="isBackTop" @click.native="BackClick" />
  </div>
</template>

<script>
//公共组件-common
import NavBar from "components/common/navbar/NavBar";
import Scroll from "components/common/scroll/Scroll";
//公共组件-content
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";

//公共工具
import { debounce } from "common/utils";
import { itemListenerMixin, BackTopMixin } from "common/mixin";
//网络请求
import { getHomeMultidata, getHomeGoods } from "network/home";
//子组件
import HomeSwiper from "./childsHome/HomeSwiper";
import HomeRecommend from "./childsHome/HomeRecommend";
import HomePicture from "./childsHome/HomePicture";

export default {
  name: "Home",
  components: {
    NavBar,
    Scroll,
    GoodsList,
    TabControl,

    HomeSwiper,
    HomeRecommend,
    HomePicture
  },
  data() {
    return {
      banner: [],
      recommend: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: "pop",
      taboffsetTop: 0,
      isTab1: false,
      saveY: 0
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  created() {
    //请求轮播图和横向图片数据
    this.getHomeMultidata();

    //请求goods数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  mixins: [itemListenerMixin, BackTopMixin],
  mounted() {
    /* //计算可滑动位置.这样就不会出现划不动的情况了
    const refresh = debounce(this.$refs.scroll.refresh, 200);
    this.itemImgListener = () => {
      refresh();
    };
    this.$bus.$on("loadMore", this.itemImgListener); */
    console.log("嘿嘿嘿");
  },
  activated() {
    //方法1,将刷新放到上面
    this.$refs.scroll.refresh();
    this.$refs.scroll.ScrollTo(0, this.saveY, 0);
    //方法2, 如果方法1失效了,那么我们就先卸载better-scroll,然后安装指定版本@1.13.2
  },
  deactivated() {
    //1.保存Y值
    this.saveY = this.$refs.scroll.getScrollY();
    //2.销毁监听事件
    this.$bus.$off("loadMore", this.itemImgListener);
  },
  methods: {
    //接收轮播图img加载完成的消息
    swiperImgLoad() {
      this.taboffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },
    //接收到scroll发来的消息,已经到达底部了!
    Loadbottom() {
      this.getHomeGoods(this.currentType);
    },
    //计算滑动距离
    constScroll(position) {
      this.listenShowBackTop(position);
      this.isTab1 = -position.y > this.taboffsetTop;
    },

    //根据index切换当前type
    tabIndex(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },

    //网络数据请求
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        this.banner = res.data.banner.list;
        this.recommend = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;
        //实现可以再次加载数据
        this.$refs.scroll.finishPullUp();
      });
    }
  }
};
</script>

<style scoped>
#home {
  height: 100vh;
  /*  padding-top: 44px;
  position: relative; */
}
.home-nav {
  color: #fff;
  background-color: var(--color-tint);
  /*   position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}
.content {
  /* height: calc(100% - 93px);
  overflow: hidden;
  margin-top: 44px; */
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
.tab-control {
  /**当滚动时未达到我们设置的值:top=44px时
  position:static  当达到时, position:fixed
  sticky 相当于 static 跟 fixed的结合,但是兼容性比较差
  */
  position: relative;
  z-index: 9;
}
</style>