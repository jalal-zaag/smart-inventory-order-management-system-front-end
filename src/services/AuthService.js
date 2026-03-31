import * as API_URL from "../constant/APIUrl.js";
import publicAPI from "../rest-handlers/publicAPI.js";
import privateAPI from "../rest-handlers/privateAPI.js";

export default class AuthService {
    static register = data =>
        publicAPI.post(API_URL.REGISTER_URL, data).then(res => res.data);

    static login = data =>
        publicAPI.post(API_URL.LOGIN_URL, data).then(res => res.data);

    static getMe = () =>
        privateAPI.get(API_URL.GET_ME_URL).then(res => res.data);
}
