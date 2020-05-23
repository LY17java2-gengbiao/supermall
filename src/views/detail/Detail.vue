<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :rotation="rotation" />
      <detail-base-info :goods="goods" />
      <detail-shop :shop="shops" />
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
      //获取y值
      const positionY = -position.y;
      const length = this.themeTopYs.length;
      for (let i = 0; i < length - 1; i++) {
        if (
          this.currentIndex != i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
        }
        /*   if (
          this.currentIndex != i &&
          ((i < length - 1 &&
            positionY >= this.themeTopYs[i] &&
            positionY < this.themeTopYs[i + 1]) ||
            (i === length - 1 && positionY >= this.themeTopYs[i]))
        ) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
        } */
      }
      this.listenShowBackTop(position);
    },
    //监听navbar点击事件
    titleClick(index) {
      console.log(index);
      //之前设置的44px需要减去
      this.$refs.scroll.ScrollTo(0, -this.themeTopYs[index], 200);
    },
    //获取推荐数据
    getRecommend() {
      getRecommend().then(res => {
        console.log("推荐数据");

        this.recommend = res.data.list;
        console.log(this.recommend);
      });
    },
    imgLoad() {
      this.refresh();
      this.getThmemTop();
    },
    getDetail(iid) {
      getDetail(iid).then(res => {
        const data = res.result;

        //获取轮播图数据
        this.rotation = data.itemInfo.topImages;

        //获取商品信息
        this.goods = new Goods(
          data.itemInfo,
          data.columns,
          data.shopInfo.services
        );
        console.log(this.goods);
        //获取商家信息
        this.shops = new Shop(data.shopInfo);
        console.log(this.shops);
        //获取店铺信息的对象
        this.detailInfo = data.detailInfo;
        console.log(this.detailInfo);
        //获取参数信息
        this.paramInfo = new GoodsParam(
          data.itemParams.info,
          data.itemParams.rule
        );
        console.log(this.paramInfo);
        //获取评论消息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0];
        }
        console.log(this.commentInfo);
        /*    this.$nextTick(() => {
          this.themeTopYs = [];

          this.themeTopYs.push(0);
          this.themeTopYs.push(this.$refs.params.$el.offsetTop);
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
          console.log(this.themeTopYs);
        }); */
      });
    }
  },
  updated() {
    /*    this.themeTopYs = [];

    this.themeTopYs.push(0);
    this.themeTopYs.push(this.$refs.params.$el.offsetTop);
    this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
    this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
    console.log(this.themeTopYs); */
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