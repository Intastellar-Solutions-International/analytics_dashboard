import { PrimaryHost, LoginHost } from "./host";
import Authentication from "../Authentication/Auth";

const API = {
    getTotalNumber: {
        url:  `${PrimaryHost}/analytics/gdpr/getTotalNumber.php`,
        method: "POST",
        headers: {
            "Authorization": Authentication.getToken()
        }
    },
    Login: {
        url: `${LoginHost}/signin/v2/signin.php`,
    },
    getInteractions: {
        url:  `${PrimaryHost}/analytics/gdpr/getInteractions.php`,
        method: "POST",
        headers: {
            "Authorization": Authentication.getToken()
        }
    },
    getDomains: {
        url: `${PrimaryHost}/analytics/gdpr/getDomains.php`,
        method: "POST",
        headers: {
            "Authorization": Authentication.getToken()
        }
    }
}

export default API;