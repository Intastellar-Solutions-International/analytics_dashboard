import { PrimaryHost } from "./host";
import Authentication from "../Authentication/Auth";

const API = {
    getTotalNumber: {
        url:  `${PrimaryHost}/analytics/gdpr/getTotalNumber.php`,
        method: "GET",
        headers: {
            "Authorization": Authentication.getToken()
        }
    },
    Login: {
        url: `https://apis.intastellaraccounts.com/signin/v2/signin.php`,
    },
    getInteractions: {
        url:  `${PrimaryHost}/analytics/gdpr/getInteractions.php`,
        method: "GET",
        headers: {
            "Authorization": Authentication.getToken()
        }
    },
    getDomains: {
        url: `${PrimaryHost}/analytics/gdpr/getDomains.php`,
        method: "GET",
        headers: {
            "Authorization": Authentication.getToken()
        }
    }
}

export default API;