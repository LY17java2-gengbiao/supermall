import {
    ADD_COUNTER,
    ADD_TO_CART
} from './mutaition-types'

export default {
    addCart(context, payload) {
        //1.payload新添加的商品
        /* for循环方法
        let oldProduct = null;
        for (let item of state.cartList) {
          if (item.iid === payload.iid) {
            oldProduct = item
          }
        } 
        */


        return new Promise((resolove, rejcet) => {
            let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
            //2.判断oldProduct
            if (oldProduct) {
                // oldProduct.count += 1
                context.commit(ADD_COUNTER, oldProduct);
                resolove('当前商品数量+1')
            } else {
                payload.count = 1
                //state.cartList.push(payload)
                context.commit(ADD_TO_CART, payload)
                resolove('添加了新的商品')
            }
        })
    }
}