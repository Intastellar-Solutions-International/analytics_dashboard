import "./header.css";
const Link = window.ReactRouterDOM.Link;
const useLocation = window.ReactRouterDOM.useLocation;

export default function Nav() {

    const Expand = function () {
        document.querySelector(".sidebar").classList.toggle("expand");
        document.querySelector(".collapsed").classList.toggle("expand");
    };

    /* const location = useLocation();
    const { pathname } = location;
    const splitLocation = pathname.split("/"); */

    return (
        <>
            <aside className="sidebar">
                <button className="expandBtn" onClick={() => Expand() }>Expand</button>
                <nav className="collapsed">
                    <Link className={"navItems" + (window.location.href.split("/")[3] === "dashboard" ? " --active" : "")} to="/dashboard"><i className="dashboard-icons dashboard"></i> Dashboard</Link>
                    <Link className={"navItems" + (window.location.href.split("/")[3] === "websites" ? " --active" : "")} to="/websites"><i className="dashboard-icons websites"></i> Websites</Link>
                </nav>
            </aside>
        </>
    )
}