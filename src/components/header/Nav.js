import "./header.css";
import Authentication from "../../Authentication/Auth";
const Link = window.ReactRouterDOM.Link;

export default function Nav() {

    const Expand = function () {
        document.querySelector(".sidebar").classList.toggle("expand");
        document.querySelector(".collapsed").classList.toggle("expand");
    };

    return (
        <>
            <aside className="sidebar">
                <nav className="collapsed">
                    <button className="expandBtn" onClick={() => Expand() }>Expand</button>
                    <Link className={"navItems" + (window.location.href.split("/")[3] === "dashboard" ? " --active" : "")} to="/dashboard"><i className="dashboard-icons dashboard"></i> Dashboard</Link>
                    <Link className={"navItems" + (window.location.href.split("/")[3] === "websites" ? " --active" : "")} to="/websites"><i className="dashboard-icons websites"></i> Websites</Link>
                    <button className="navLogout" onClick={() => Authentication.Logout()}>Logout</button>
                </nav>
            </aside>
        </>
    )
}