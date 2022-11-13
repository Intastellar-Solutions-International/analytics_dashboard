import { PrimaryHost, LoginHost } from "./host";
import Authentication from "../Authentication/Auth";

const API = {
    Login: {
        url: `${LoginHost}/signin/v2/signin.php`,
    },
    gdpr: {
        getTotalNumber: {
            url:  `${PrimaryHost}/analytics/gdpr/getTotalNumber.php`,
            method: "GET",
            headers: {
                "Authorization": Authentication.getToken()
            }
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
    },
    ferry: {
        getTotalSales: {
            url: `${PrimaryHost}/analytics/ferry/getTotalSales.php`,
            method: "GET",
            headers: {
                "Authorization": Authentication.getToken()
            }
        }
    },
    settings: {
        getSettings: {
            url: ``,
            method: "GET",
            headers: {
                "Autorization": Authentication.getToken()
            }
        },
        createSettings: {
            url: ``,
            method: "POST",
            headers: {
                "Autorization": Authentication.getToken()
            }
        },
        updateSettings: {
            url: ``,
            method: "POST",
            headers: {
                "Autorization": Authentication.getToken()
            }
        },
        addUser: {
            url: ``,
            method: "POST",
            headers: {
                "Authorization": Authentication.getToken()
            }
        }
    }
}

export default API;