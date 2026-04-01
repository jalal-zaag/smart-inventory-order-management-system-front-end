import * as API_URL from "../constant/APIUrl.js";
import privateAPI from "../rest-handlers/privateAPI.js";

export default class DashboardService {
    static getDashboardStats = () =>
        privateAPI.get(API_URL.GET_DASHBOARD_STATS_URL).then(res => res.data);

    static getRecentActivities = params =>
        privateAPI.get(API_URL.GET_RECENT_ACTIVITIES_URL, { params }).then(res => res.data);

    static getChartData = params =>
        privateAPI.get(API_URL.GET_CHART_DATA_URL, { params }).then(res => res.data);
}
