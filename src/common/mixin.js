import { debounce } from 'common/utils'
import BackTop from "components/content/backTop/BackTop";
export const itemListenerMixin = {
    data() {
        return {
            itemImgListener: null,
            refresh: null
        }
    },
    mounted() {
        this.refresh = debounce(this.$refs.scroll.refresh, 200);

        this.itemImgListener = () => {
            this.refresh();
        };
        this.$bus.$on("loadMore", this.itemImgListener);
        console.log('我是混入的内容')
    }
}


export const BackTopMixin = {
    components: {
        BackTop
    },
    data() {
        return {
            isBackTop: false
        }
    },
    methods: {
        BackClick() {
            this.$refs.scroll.ScrollTo(0, 0, 1000);
        },
        listenShowBackTop(position) {
            this.isBackTop = -position.y > 1000;
        }
    }
}