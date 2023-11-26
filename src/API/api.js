import { PrimaryHost, LoginHost } from "./host";
import Authentication from "../Authentication/Auth";

const API = {
    Login: {
        url: `${LoginHost}/signin/v2/signin.php`,
    },
    SignUp: {
        url: `${LoginHost}/consents/signup/v1/signup.php`,
    },
    Subscription: {
        url: `${PrimaryHost}/payment/subscription/v1/subscription.php`,
        method: "POST",
        headers: {
            "Authorization": Authentication.getToken(),
            "Content-Type": "application/json"
        }
    },
    gdpr: {
        getTotalNumber: {
            url:  `${PrimaryHost}/analytics/gdpr/getTotalNumber.php`,
            method: "GET",
            headers: {
                "Authorization": Authentication.getToken(),
                "Organisation": Authentication.getOrganisation(),
                "Content-Type": "application/json"
            }
        },
        getDomainsUrl: {
            url: `${PrimaryHost}/analytics/gdpr/getDomainStatistics.php`,
            method: "GET",
            headers: {
                "Authorization": Authentication.getToken(),
                "Organisation": Authentication.getOrganisation(),
                "Content-Type": "application/json"
            }
        },
        getInteractions: {
            url:  `${PrimaryHost}/analytics/gdpr/getInteractions.php`,
            method: "GET",
            headers: {
                "Authorization": Authentication.getToken(),
                "Organisation": Authentication.getOrganisation(),
                "Content-Type": "application/json"
            }
        },
        getDomains: {
            url: `${PrimaryHost}/analytics/gdpr/getDomains.php`,
            method: "GET",
            headers: {
                "Authorization": Authentication.getToken(),
                "Organisation": Authentication.getOrganisation(),
                "Content-Type": "application/json"
            }
        },
        getDevices: {
            url: `${PrimaryHost}/analytics/gdpr/getDevices.php`,
            method: "GET",
            headers: {
                "Authorization": Authentication.getToken(),
                "Organisation": Authentication.getOrganisation(),
                "Content-Type": "application/json"
            }
        },
        getCookies: {
            url: `${PrimaryHost}/analytics/gdpr/cookiesAPI.php`,
            method: "GET",
            headers: {
                "Authorization": Authentication.getToken(),
                "Organisation": Authentication.getOrganisation(),
                "Content-Type": "application/json"
            }
        }
    },
    ferry: {
        getTotalSales: {
            url: `${PrimaryHost}/analytics/ferry/getTotalSales.php`,
            method: "GET",
            headers: {
                "Authorization": Authentication.getToken(),
                "Content-Type": "application/json"
            }
        }
    },
    settings: {
        getOrganisation: {
            url: `${PrimaryHost}/analytics/settings/getOrganisation.php`,
            method: "POST",
            headers: {
                "Authorization": Authentication.getToken(),
                "Content-Type": "application/json"
            }
        },
        createOrganisation: {
            url: `${PrimaryHost}/analytics/settings/create-organisation.php`,
            method: "POST",
            headers: {
                "Authorization": Authentication.getToken(),
                "Content-Type": "application/json"
            }
        },
        updateSettings: {
            url: `${PrimaryHost}/analytics/settings/updateSettings.php`,
            method: "POST",
            headers: {
                "Authorization": Authentication.getToken(),
                "Organisation": Authentication.getOrganisation(),
                "Content-Type": "application/json"
            }
        },
        addUser: {
            url: `${PrimaryHost}/analytics/settings/add-user.php`,
            method: "POST",
            headers: {
                "Authorization": Authentication.getToken(),
                "Content-Type": "application/json"
            }
        },
        getSettings: {
            url: `${PrimaryHost}/analytics/settings/getOrganisation.php`,
            method: "GET",
            headers: {
                "Authorization": Authentication.getToken(),
                "Organisation": Authentication.getOrganisation(),
                "Content-Type": "application/json"
            }
        },
        createSettings: {
            url: `${PrimaryHost}/analytics/settings/create-organisation.php`,
            method: "POST",
            headers: {
                "Authorization": Authentication.getToken(),
                "Organisation": Authentication.getOrganisation(),
                "Content-Type": "application/json"
            }
        },
        addDomain: {
            url: `${PrimaryHost}/analytics/settings/add-domain.php`,
            method: "POST",
            headers: {
                "Authorization": Authentication.getToken(),
                "Content-Type": "application/json"
            }
        },
        user: {
            headers: {
                "Authorization": Authentication.getToken(),
                "Content-Type": "application/json"
            },
            update: {
                url: `${PrimaryHost}/analytics/settings/user.php`,
                method: "POST"
            },
            get: {
                url: `${PrimaryHost}/analytics/settings/getUserSettings.php`,
                method: "POST"
            },
        }
    },
    ferry: {
        getTotalSales: {
            url: `${PrimaryHost}/analytics/ferry/getTotalSales.php`,
            method: "GET",
            headers: {
                "Authorization": Authentication.getToken(),
                "Organisation": Authentication.getOrganisation(),
                "Content-Type": "application/json"
            }
        }
    },
    github: {
        createIssue: {
            url: "https://api.github.com/repositories/Intastellar-Solutions-International/intastellar-analytics/issues",
            method: "POST",
            headers: {
                "Authorization": "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",
                'X-GitHub-Api-Version': '2022-11-28',
            }
        }
    }
};

export default API;