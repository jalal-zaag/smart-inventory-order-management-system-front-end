import * as API_URL from "../constant/APIUrl.js";
import privateAPI from "../rest-handlers/privateAPI.js";

export default class OrderService {
    static getOrderList = params =>
        privateAPI.get(API_URL.GET_ALL_ORDERS_URL, { params });

    static createOrder = data =>
        privateAPI.post(API_URL.CREATE_ORDER_URL, data);

    static getOrder = id =>
        privateAPI.get(API_URL.GET_ORDER_URL(id));

    static updateOrder = (id, data) =>
        privateAPI.put(API_URL.UPDATE_ORDER_URL(id), data);

    static cancelOrder = id =>
        privateAPI.post(API_URL.CANCEL_ORDER_URL(id));

    static deleteOrder = id =>
        privateAPI.delete(API_URL.DELETE_ORDER_URL(id));
}
