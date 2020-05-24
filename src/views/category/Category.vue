<template>
  <div class="category">
    <nav-bar class="category-nav">
      <div slot="center">商品分类</div>
    </nav-bar>

    <div class="content">
      <category-tab-menu :categories="categories" @menuIndex="menuIndex" />
      <scroll id="tab-content" ref="scroll">
        <div>
          <category-tab-content :subcategories="showSubcategory" />
        </div>
        <tab-control :titles="['综合','新品','销量']" @tabIndex="tabIndex" />

        <category-tab-detail :categoryDetail="showCategoryDetail" />
      </scroll>
    </div>
  </div>
</template>

<script>
/**公共组件---common */
import NavBar from "components/common/navbar/NavBar";
import Scroll from "components/common/scroll/Scroll";
/**公共组件---content */
import TabControl from "components/content/tabControl/TabControl";

/**网络数据请求 */
import {
  getCategory,
  getSubcategory,
  getCategoryDetail
} from "network/category";
/**子组件 */
import CategoryTabMenu from "./childComps/CategoryTabMenu";
import CategoryTabContent from "./childComps/CategoryTabContent";
import CategoryTabDetail from "./childComps/CategoryTabDetail";
/**工具 */
import { debounce } from "common/utils";

export default {
  name: "Category",
  components: {
    /**公共组件 */
    NavBar,
    Scroll,
    TabControl,
    /**子组件 */
    CategoryTabMenu,
    CategoryTabContent,
    CategoryTabDetail
  },
  data() {
    return {
      categories: [],
      categoryData: {},
      currentIndex: -1,
      currentType: "pop",
      taboffsetTop: 0
    };
  },
  created() {
    // 1.请求分类数据
    this._getCategory();
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 200);
    this.$bus.$on("imgLoad", () => {
      refresh();
    });
  },
  computed: {
    //在右侧展示的数据
    showSubcategory() {
      if (this.currentIndex === -1) return {};
      return this.categoryData[this.currentIndex].subcategories;
    },
    showCategoryDetail() {
      if (this.currentIndex === -1) return [];
      return this.categoryData[this.currentIndex].categoryDetail[
        this.currentType
      ];
    }
  },
  methods: {
    _getCategory() {
      getCategory().then(res => {
        //1.获取分类的全部数据 并且赋值给this.categories
        this.categories = res.data.category.list;
        console.log(this.categories);
        // 2.初始化每个类别的子数据
        for (let i = 0; i < this.categories.length; i++) {
          this.categoryData[i] = {
            subcategories: {},
            categoryDetail: {
              pop: [],
              new: [],
              sell: []
            }
          };
        }
        // 3.请求第一个分类的数据
        this._getSubcategories(0);
      });
    },
    _getSubcategories(index) {
      this.currentIndex = index;
      const mailKey = this.categories[index].maitKey;
      getSubcategory(mailKey).then(res => {
        this.categoryData[index].subcategories = res.data;
        console.log("_getgory:");
        console.log(res.data);
        this.categoryData = { ...this.categoryData };
        this._getCategoryDetail("pop");
        this._getCategoryDetail("sell");
        this._getCategoryDetail("new");
      });
    },
    _getCategoryDetail(type) {
      // 1.获取请求的miniWallkey
      const miniWallkey = this.categories[this.currentIndex].miniWallkey;
      // 2.发送请求,传入miniWallkey和type
      getCategoryDetail(miniWallkey, type).then(res => {
        // 3.将获取的数据保存下来
        this.categoryData[this.currentIndex].categoryDetail[type] = res;
        this.categoryData = { ...this.categoryData };

        console.log(this.categoryData[this.currentIndex].categoryDetail[type]);
      });
    },

    /**监听左侧点击事件 */
    menuIndex(index) {
      console.log("当前的index=" + index);
      this.currentIndex = index;
      this._getSubcategories(this.currentIndex);
    },
    /**监听tab面板点击 */
    tabIndex(index) {
      console.log(index);
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
      this._getCategoryDetail(this.currentType);
    }
  }
};
</script>

<style scoped>
.category {
  height: 100vh;
}
.category-nav {
  color: #fff;
  font-weight: 700;
  background-color: var(--color-tint);
}
.content {
  position: absolute;
  left: 0;
  right: 0;
  top: 44px;
  bottom: 49px;
  display: flex;
}
#tab-content {
  height: 100%;
  flex: 1;
  overflow: hidden;
}
</style>