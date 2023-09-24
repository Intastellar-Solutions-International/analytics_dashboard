import "./header.css";
import Authentication from "../../Authentication/Auth";
const Link = window.ReactRouterDOM.Link;
const useLocation = window.ReactRouterDOM.useLocation;

export default function Nav() {
    const Expand = function () {
        document.querySelector(".sidebar").classList.toggle("expand");
        document.querySelector(".collapsed").classList.toggle("expand");
    };
    
    return (
        <>
            <aside className="sidebar">
                <nav className="collapsed">
                    <button className="expandBtn" onClick={() => Expand() }></button>
                    <Link className={"navItems" + (useLocation().pathname === "/dashboard" ? " --active" : "")} to="/dashboard"><i className="dashboard-icons dashboard"></i> <span className="hiddenCollapsed">Dashboard</span></Link>
                    <Link className={"navItems" + (useLocation().pathname === "/domains" ? " --active" : "")} to="/domains"><i className="dashboard-icons domains"></i> <span className="hiddenCollapsed">Domains</span></Link>
                    <Link className={"navItems" + (useLocation().pathname === "/user-consents" ? " --active" : "")} to="/user-consents"><i className="dashboard-icons domains"></i> <span className="hiddenCollapsed">User Consents</span></Link>
                    <section className="navItems--bottom">
                        <Link className={"navItems" + (useLocation().pathname.indexOf("/settings") > -1 ? " --active" : "")} to="/settings"><i className="dashboard-icons settings"></i> <span className="hiddenCollapsed">Settings</span></Link>
                        <button className="navLogout" onClick={() => Authentication.Logout()}><i className="dashboard-icons logout"></i> <span className="hiddenCollapsed">Logout</span></button>
                    </section>
                </nav>
            </aside>
        </>
    )
}