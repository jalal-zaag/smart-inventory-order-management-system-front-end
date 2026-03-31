import * as API_URL from "../constant/APIUrl.js";
import privateAPI from "../rest-handlers/privateAPI.js";

export default class RestockService {
    static getRestockQueue = params =>
        privateAPI.get(API_URL.GET_RESTOCK_QUEUE_URL, { params }).then(res => res.data);

    static restockProduct = (id, data) =>
        privateAPI.post(API_URL.RESTOCK_PRODUCT_URL(id), data).then(res => res.data);

    static removeFromQueue = id =>
        privateAPI.delete(API_URL.REMOVE_FROM_QUEUE_URL(id)).then(res => res.data);
}
