import SideNav from "../../Components/Header/SideNav";
const useParams = window.ReactRouterDOM.useParams;

export const reportsLinks = [
    {
        name: "User Consents",
        path: "/reports/user-consents"
    },
    {
        name: "Countries",
        path: "/reports/countries"
    },
    {
        name: "Site Status",
        path: "/reports/site-status"
    }
]

export default function Reports() {
    document.title = "Reports | Intastellar Analytics";
    return <>
        <SideNav links={reportsLinks} />
        <div className="dashboard-content">
            <h1>Reports</h1>
        </div>
    </>
}