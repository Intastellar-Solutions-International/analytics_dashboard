import AddDomain from "../../../Components/AddDomain/AddDomain"
import SideNav from "../../../Components/Header/SideNav"
import { reportsLinks } from "../../../Components/Header/SideNavLinks"
export default function SettingsAddDomain(){
    return <>
        <SideNav links={reportsLinks} />
        <AddDomain />
    </>
}