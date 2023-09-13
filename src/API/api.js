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
                "Authorization": Authentication.getToken(),
                "Organisation": Authentication.getOrganisation()
            }
        },
        getInteractions: {
            url:  `${PrimaryHost}/analytics/gdpr/getInteractions.php`,
            method: "GET",
            headers: {
                "Authorization": Authentication.getToken(),
                "Organisation": Authentication.getOrganisation()
            }
        },
        getDomains: {
            url: `${PrimaryHost}/analytics/gdpr/getDomains.php`,
            method: "GET",
            headers: {
                "Authorization": Authentication.getToken(),
                "Organisation": Authentication.getOrganisation()
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
        getOrganisation: {
            url: `${PrimaryHost}/analytics/settings/getOrganisation.php`,
            method: "POST",
            headers: {
                "Authorization": Authentication.getToken()
            }
        },
        createOrganisation: {
            url: `${PrimaryHost}/analytics/settings/create-organisation.php`,
            method: "POST",
            headers: {
                "Authorization": Authentication.getToken()
            }
        },
        updateSettings: {
            url: `${PrimaryHost}/analytics/settings/updateSettings.php`,
            method: "POST",
            headers: {
                "Authorization": Authentication.getToken(),
                "Organisation": Authentication.getOrganisation()
            }
        },
        addUser: {
            url: `${PrimaryHost}/analytics/settings/add-user.php`,
            method: "POST",
            headers: {
                "Authorization": Authentication.getToken(),
            }
        },
        getSettings: {
            url: `${PrimaryHost}/analytics/settings/getOrganisation.php`,
            method: "GET",
            headers: {
                "Authorization": Authentication.getToken(),
                "Organisation": Authentication.getOrganisation()
            }
        },
        createSettings: {
            url: `${PrimaryHost}/analytics/settings/create-organisation.php`,
            method: "POST",
            headers: {
                "Authorization": Authentication.getToken(),
                "Organisation": Authentication.getOrganisation()
            }
        },
    },
    ferry: {
        getTotalSales: {
            url: `${PrimaryHost}/analytics/ferry/getTotalSales.php`,
            method: "GET",
            headers: {
                "Authorization": Authentication.getToken(),
                "Organisation": Authentication.getOrganisation()
            }
        }
    },
};

export default API;