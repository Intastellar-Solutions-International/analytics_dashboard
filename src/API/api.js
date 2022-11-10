import { PrimaryHost } from "./host";


const API = {
    getTotalNumber: {
        url:  `${PrimaryHost}/analytics/gdpr/getTotalNumber.php`,
        method: "GET",
        headers: {
            "Authorization": "Basic " + JSON.parse(localStorage.getItem("globals"))?.token
        }
    },
    Login: {
        url: `https://apis.intastellaraccounts.com/signin/v2/signin.php`,
    },
    getInteractions: {
        url:  `${PrimaryHost}/analytics/gdpr/getInteractions.php`,
        method: "GET",
        headers: {
            "Authorization": "Basic " + JSON.parse(localStorage.getItem("globals"))?.token
        }
    }
}

export default API;