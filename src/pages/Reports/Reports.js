import SideNav from "../../Components/Header/SideNav"
export default function Reports() {
    return <>
        <SideNav links={[
            {
                name: "User Consents",
                path: "/reports/user-consents",
                icon: "user-consents"
            }
        ]} />
        <div className="dashboard-content">
            <h1>Reports</h1>
        </div>
    </>
}