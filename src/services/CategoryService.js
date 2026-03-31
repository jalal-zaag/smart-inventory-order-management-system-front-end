import * as API_URL from "../constant/APIUrl.js";
import privateAPI from "../rest-handlers/privateAPI.js";

export default class CategoryService {
    static getCategoryList = params =>
        privateAPI.get(API_URL.GET_ALL_CATEGORIES_URL, { params });

    static createCategory = data =>
        privateAPI.post(API_URL.CREATE_CATEGORY_URL, data);

    static getCategory = id =>
        privateAPI.get(API_URL.GET_CATEGORY_URL(id));

    static updateCategory = (id, data) =>
        privateAPI.put(API_URL.UPDATE_CATEGORY_URL(id), data);

    static deleteCategory = id =>
        privateAPI.delete(API_URL.DELETE_CATEGORY_URL(id));
}
