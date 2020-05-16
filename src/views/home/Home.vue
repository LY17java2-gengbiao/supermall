<template>
  <div id="home">
    <!--导航栏 -->
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <!--tab面板-上-->
    <tab-control
      class="tab-control"
      :titles="['流行','新款','精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      v-show="isTabFixed1"
    />

    <scroll
      class="content"
      ref="scrolls"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <!--轮播图-->
      <home-swiper :cbanners="banners" @swiperImgLoad="swiperImgLoad" />
      <!--横向图片链接-->
      <home-recommend-view :recommends="recommends" />
      <!--一张大的图片-->
      <home-feature-view></home-feature-view>
      <!--tab面板-下-->
      <tab-control
        class="tab-control"
        :titles="['流行','新款','精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      />
      <!--图片展示组件-->
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <!--回到顶部组件  .native修饰符=>监听组件根元素 -->
    <back-top v-show="isBackTopShow" @click.native="backTopClick"></back-top>
  </div>
</template>

<script>
//公共组件
import NavBar from "components/common/navbar/NavBar"; //==>导航栏(home中是购物街那一块)
import TabControl from "components/content/tabControl/TabControl"; //==>tab面板
import GoodsList from "components/content/goods/GoodsList"; //显示下面一堆图片的组件
import Scroll from "components/common/scroll/Scroll"; //======>封装起来的better-scroll
import BackTop from "components/content/backTop/BackTop"; //===>按钮,返回最上面的按钮
//数据组件
import { getHomeMultidata, getHomeGoods } from "network/home"; //network中的两个调用数据的方法
//子组件
import HomeSwiper from "./childComps/HomeSwiper"; //轮播图
import HomeRecommendView from "./childComps/HomeRecommendView"; //轮播图下面的那4个图片
import HomeFeatureView from "./childComps/HomeFeatureView"; //一整个图片

//公共工具
import { debounce } from "common/utils"; //防抖函数

export default {
  name: "Home",
  components: {
    NavBar, //导航栏
    TabControl, //tab面板
    GoodsList, //图片显示组件
    Scroll, //better-scroll第三方框架
    BackTop, //回到顶部按钮
    HomeSwiper, //轮播图
    HomeRecommendView, //横排图片链接
    HomeFeatureView //一张图片
  },
  data() {
    return {
      banners: [], //通过父子组件通信  向轮播图swiper传递过去该数组
      recommends: [], //通过父子组件通信 向横向图片链接传递过去该数组
      goods: {
        //为tab面板设计的数据接收格式
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: "pop", //当前type值
      isBackTopShow: false, //是否显示回到顶部组件
      taboffsetTop: 0, //tab面板的offsetTop(元素到offsetParent顶部的距离)
      isTabFixed1: false, //是否显示isTabFixed1
      saveY: 0 //保存y值
    };
  },
  computed: {
    //向展示图片组件goods传递数组数据
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  //创建完成组件
  created() {
    //1.请求多个数据  =======>调用getHomeMultidata方法
    this.getHomeMultidata();
    //2.请求分页那一堆数据 =======>调用getHomeGoods方法
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  //挂载结束状态(挂载成功)
  mounted() {
    //防抖函数的调用,进行防抖处理
    const refresh = debounce(this.$refs.scrolls.refresh, 200);
    //1.监听GoodsListItem里面的$emit
    this.$bus.$on("itemImgLoad", () => {
      refresh();
    });
  },
  //只有当组件被<keep-alive>包裹时才会有activated和deactivated这两个钩子函数
  //回到该组件时 ==========>  activated(激活)
  activated() {
    console.log("activated");
    this.$refs.scrolls.ScrollTo(0, this.saveY, 0); //载入离开时的y值
    this.$refs.scrolls.refresh(); //刷新下
  },
  //离开该组件时  ==============> deactivated(停止,解散)
  deactivated() {
    console.log("deactivated");
    this.saveY = this.$refs.scrolls.getScrollY(); //获取离开时的y值是多少
  },
  methods: {
    /**
     * 事件监听相关的方法
     */
    //父子组件通信,从TabControl.vue子组件传递过来的自定义事件,根据传递过来的参数改变当前type的值
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    //监听回到顶部组件,如果点击了就回到x=0,y=0的地方,在1秒中完成这个动作
    backTopClick() {
      /**
       * scrolls:我们在上面<scroll>组件标签中声明的 ref
       * this.$refs.scrolls:获取到关于scroll组件的根
       * srcoll:是获取到srcoll组件中的srcoll对象
       * scrollTo方法:作用是去到哪个地方,可以传入3个参数,第一个参数是x坐标,
       * 第二个参数是y坐标,第三个参数是毫秒,意思是多少毫秒内完成这个动作
       *
       *   封装scrollto()方法前
       *   this.$refs.scrolls.scroll.scrollTo(0, 0, 1000);
       */
      /**在scroll组件中封装一下ScrollTo方法 */
      this.$refs.scrolls.ScrollTo(0, 0, 1000);
    },
    //父子组件通信,从Scroll.vue子组件中传递过来的自定义方法,目的是传递过来滚动的位置,也就是y值
    contentScroll(position) {
      //1.判断BackTop是否显示
      //  this.isShow = position.y < -1000;
      this.isBackTopShow = -position.y > 1000;

      //2.决定tabControl是否吸顶(position:fixed)
      this.isTabFixed1 = -position.y > this.taboffsetTop;
    },
    //父子组件通信,从Scroll.vue子组件中传递过来的自定义方法,目的是让告知,已经到达了底部;
    loadMore() {
      this.getHomeGoods(this.currentType); //调用获取数据的方法,传递参数为当前type
    },
    //父子组件通信,从HomeSwiper组件中传递过来的自定义方法,将获取到的<img @load>事件触发
    swiperImgLoad() {
      //获取tabControl中的offsetTop
      this.taboffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },
    /**
     * 网络请求相关的方法
     */
    getHomeMultidata() {
      //调用network里面封装好的getHomeMultidata方法
      getHomeMultidata().then(res => {
        console.log(res.data);
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      //声明一个page 获取data中goods里面的type里面的page+1
      const page = this.goods[type].page + 1;
      //调用network中封装好的getHomeGoods方法,需要传递2个参数(type,page)
      getHomeGoods(type, page).then(res => {
        // ...语法   ====>   在push里面...代表了可以传入多个值,用','隔开即刻
        //下面这里是push(...数组)====>  将这个数组解构之后再加进this.goods[type].list数组里面去
        //下面这个相当于  用for循环将另一个数组中的数据遍历出来加入当前数组中去
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1; //给当前type下的page+=1
        //完成上拉加载更多
        this.$refs.scrolls.finishPullUp();
      });
    }
  }
};
</script>

<style scoped>
#home {
  height: 100vh;
  /*   padding-top: 44px; */
  /*   position: relative; */
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
.tab-control {
  /**当滚动时未达到我们设置的值:top=44px时
  position:static  当达到时, position:fixed
  sticky 相当于 static 跟 fixed的结合,但是兼容性比较差
  */
  position: relative;
  z-index: 9;
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
</style>