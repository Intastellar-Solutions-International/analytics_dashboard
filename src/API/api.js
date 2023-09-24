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
        getDomainsUrl: {
            url: `${PrimaryHost}/analytics/gdpr/getDomainStatistics.php`,
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
    github: {
        createIssue: {
            url: "https://github.acme-inc.com/api/v3/repos/Intastellar-Solutions-International/intastellar-analytics/issues",
            method: "POST",
            headers: {
                "Authorization": "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",
                'X-GitHub-Api-Version': '2022-11-28',
            }
        }
    }
};

export default API;