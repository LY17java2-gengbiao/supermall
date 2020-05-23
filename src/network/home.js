import { request } from './request'
//获取首页的多个数据
export function getHomeMultidata() {
    return request({
        url: '/home/multidata'
    })
}
//获取首页的goods
export function getHomeGoods(type, page) {
    return request({
        url: '/home/data',
        params: {
            type,
            page
        }
    })
}