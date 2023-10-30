export const reportsLinks = [
    {
        name: "Add new User",
        path: "/settings/add-user",
        view: ["admin", "super-admin"]
    },
    {
        name: "View Users",
        path: "/settings/view-users",
        view: ["admin", "super-admin", "manager"]
    },
    {
        name: "Create new Organisation",
        path: "/settings/create-organisation",
        view: ["admin", "super-admin"]
    },
    {
        name: "View Organisations",
        path: "/settings/view-organisations",
        view: ["admin", "super-admin", "user", "manager"]
    },
    {
        name: "Add new Domain",
        path: "/settings/add-domain",
        view: ["admin", "super-admin", "manager"]
    },
    {
        name: "View Domains",
        path: "/settings/view-domains",
        view: ["admin", "super-admin", "manager"]
    }
]