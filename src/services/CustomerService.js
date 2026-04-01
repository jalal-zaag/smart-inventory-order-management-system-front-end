import * as API_URL from "../constant/APIUrl.js";
import privateAPI from "../rest-handlers/privateAPI.js";

export default class CustomerService {
    static getCustomerList = params =>
        privateAPI.get(API_URL.GET_ALL_CUSTOMERS_URL, { params }).then(res => res.data);

    static getCustomer = id =>
        privateAPI.get(API_URL.GET_CUSTOMER_URL(id)).then(res => res.data);

    static updateCustomer = (id, data) =>
        privateAPI.put(API_URL.UPDATE_CUSTOMER_URL(id), data).then(res => res.data);

    static deleteCustomer = id =>
        privateAPI.delete(API_URL.DELETE_CUSTOMER_URL(id)).then(res => res.data);
}
