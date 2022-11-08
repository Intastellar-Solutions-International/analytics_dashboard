import {PrimaryHost} from "./host";
const API = {
    getTotalNumber: {
        url:  `${PrimaryHost}/analytics/gdpr/getTotalNumber.php`,
        method: "GET",
    },
    Login: {
        url: `https://apis.intastellaraccounts.com/signin/v2/signin.php`,
    }
}

export default API;