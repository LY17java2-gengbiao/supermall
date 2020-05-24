<template>
  <div id="detail">
    <!--导航栏-->
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <!--better-scroll-->
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <!--轮播图-->
      <detail-swiper :rotation="rotation" />
      <!--获取商品信息-->
      <detail-base-info :goods="goods" />
      <!--获取商家信息-->
      <detail-shop :shop="shops" />
      <!--获取店铺信息========>还有一堆图片哟-->
      <detail-goods-info :detailInfo="detailInfo" @imgLoad="imgLoad" />
      <!--参数-->
      <detail-param-info ref="params" :paramInfo="paramInfo" />
      <!--评论-->
      <detail-comment-info ref="comment" :commentInfo="commentInfo" />
      <!--推荐-->
      <goods-list ref="recommend" :goods="recommend" />
    </scroll>
    <back-top v-show="isBackTop" @click.native="BackClick" />
    <detail-bottom-bar @addCart="addToCart" />
    <toast :message="message" :isShow="isShow" />
  </div>
</template>

<script>
//公共组件
import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";
//子组件导入
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShop from "./childComps/DetailShop";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";
//网络数据请求
import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend
} from "network/detail";
//公共工具
import { debounce } from "common/utils";
import { itemListenerMixin, BackTopMixin } from "common/mixin";
//vuex映射
import { mapActions } from "vuex";

import Toast from "components/common/toast/Toast";

export default {
  name: "Detail",
  components: {
    Scroll,
    Toast,
    GoodsList,
    DetailNavBar,
    DetailSwiper,
    DetailShop,
    DetailBaseInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar
  },
  data() {
    return {
      iid: null,
      rotation: [],
      goods: {},
      shops: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommend: [],
      themeTopYs: [],
      getThmemTop: null,
      currentIndex: 0,
      message: "",
      isShow: false
    };
  },
  created() {
    //获取iid
    this.iid = this.$route.params.iid;
    //获取轮播图数据
    this.getDetail(this.iid);
    //获取推荐数据
    this.getRecommend();
    //给getThemeTop赋值(对给this.themeTopYs赋值进行防抖)
    this.getThmemTop = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE);
      console.log(this.themeTopYs);
    }, 100);
  },
  mixins: [itemListenerMixin, BackTopMixin],
  mounted() {
    console.log("哈哈哈");
  },
  destroyed() {
    this.$bus.$off("loadMore", this.itemImgListener);
  },
  methods: {
    ...mapActions(["addCart"]),
    //监听加入购物车事件
    addToCart() {
      //1.
      const product = {};
      product.image = this.rotation[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;
      //2.
      /*  this.$store.dispatch("addCart", product).then(res => {
        console.log(res);
      }); */
      this.addCart(product).then(res => {
        /* this.isShow = true;
        this.message = res;

        setTimeout(() => {
          this.isShow = false;
          this.message = "";
        }, 2000); */
        /*  this.$toast.show(res, 2000); */
        this.$toast.show(res); //两个参数:1.要显示的提示语,2.显示时间,不传默认为2000毫秒
      });
    },
    //监听滚动事件
    contentScroll(position) {
      //获取滚动的y值
      const positionY = -position.y;
      //获取themeTopYs数组的长度
      const length = this.themeTopYs.length;
      //for循环遍历, 我们知道长度有5个,最后一个是number的最大值
      for (let i = 0; i < length - 1; i++) {
        if (
          this.currentIndex != i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }
      //混入: mixin中的是否显示返回顶部方法
      this.listenShowBackTop(position);
    },
    //监听navbar点击事件
    titleClick(index) {
      console.log(index);
      this.$refs.scroll.ScrollTo(0, -this.themeTopYs[index], 200);
    },
    //获取推荐数据
    getRecommend() {
      getRecommend().then(res => {
        this.recommend = res.data.list;
        console.log("推荐数据:");
        console.log(this.recommend);
      });
    },
    imgLoad() {
      this.refresh();
      this.getThmemTop();
    },
    getDetail(iid) {
      getDetail(iid).then(res => {
        //获取商品详情页的全部数据 data
        const data = res.result;
        console.log("详情页的所有数据如下:");
        console.log(data);
        //获取轮播图数据
        this.rotation = data.itemInfo.topImages;

        //获取商品信息=======>传递到DetailBaseInfo子组件中去
        //Goods是在network/detail中声明的class类 将获取到的数据当做参数传递过去
        this.goods = new Goods(
          data.itemInfo,
          data.columns,
          data.shopInfo.services
        );
        //获取商家信息=======>传递到DetailShop子组件中去
        this.shops = new Shop(data.shopInfo);
        //获取店铺信息的对象
        this.detailInfo = data.detailInfo;
        //获取参数信息
        this.paramInfo = new GoodsParam(
          data.itemParams.info,
          data.itemParams.rule
        );
        //获取评论消息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0];
        }
      });
    }
  }
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.content {
  position: relative;
  height: calc(100% - 44px - 63px);
  overflow: hidden;
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
</style>