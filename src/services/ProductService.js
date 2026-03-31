import * as API_URL from "../constant/APIUrl.js";
import privateAPI from "../rest-handlers/privateAPI.js";

export default class ProductService {
    static getProductList = params =>
        privateAPI.get(API_URL.GET_ALL_PRODUCTS_URL, { params }).then(res => res.data);

    static createProduct = data =>
        privateAPI.post(API_URL.CREATE_PRODUCT_URL, data).then(res => res.data);

    static getProduct = id =>
        privateAPI.get(API_URL.GET_PRODUCT_URL(id)).then(res => res.data);

    static updateProduct = (id, data) =>
        privateAPI.put(API_URL.UPDATE_PRODUCT_URL(id), data).then(res => res.data);

    static deleteProduct = id =>
        privateAPI.delete(API_URL.DELETE_PRODUCT_URL(id)).then(res => res.data);
}
