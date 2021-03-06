import { request } from './request'
//获取详情页的所有数据
export function getDetail(iid) {
    return request({
        url: '/detail',
        params: {
            iid
        }
    })
}

/**获取商品的信息 */
export class Goods {
    constructor(itemInfo, columns, services) {
        this.title = itemInfo.title
        this.desc = itemInfo.desc
        this.newPrice = itemInfo.price
        this.oldPrice = itemInfo.oldPrice
        this.discount = itemInfo.discountDesc
        this.columns = columns
        this.services = services
        this.realPrice = itemInfo.lowNowPrice
    }
}
/**获取商家的信息 */
export class Shop {
    constructor(shopInfo) {
        this.logo = shopInfo.shopLogo
        this.name = shopInfo.name
        this.fans = shopInfo.cFans
        this.sells = shopInfo.cSells
        this.score = shopInfo.score
        this.goodsCount = shopInfo.cGoods
    }
}
/**获取参数信息 */
export class GoodsParam {
    constructor(info, rule) {
        //注意:images可能没值(某些商品可能有值,某些商品可能没值)
        this.image = info.images ? info.images[0] : ""
        this.infos = info.set
        this.sizes = rule.tables
    }
}

//请求推荐数据
export function getRecommend() {
    return request({
        url: "/recommend"
    })
}