import * as API_URL from "../constant/APIUrl.js";
import privateAPI from "../rest-handlers/privateAPI.js";

export default class ActivityLogService {
    static getActivityLogList = params =>
        privateAPI.get(API_URL.GET_ALL_ACTIVITY_LOGS_URL, { params }).then(res => res.data);

    static getActivityLog = id =>
        privateAPI.get(API_URL.GET_ACTIVITY_LOG_URL(id)).then(res => res.data);
}
