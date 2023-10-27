import AddDomain from "../../../Components/AddDomain/AddDomain"
import SideNav from "../../../Components/Header/SideNav"
export default function SettingsAddDomain(){
    const reportsLinks = [
        {
            name: "Add new User",
            path: "/settings/add-user",
            view: ["admin", "super-admin"]
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
        }
    ]
    return <>
        <SideNav links={reportsLinks} />
        <AddDomain />
    </>
}