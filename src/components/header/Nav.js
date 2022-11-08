const Link = window.ReactRouterDOM.Link;

export default function Nav() {
    
    return (
        <>
            <nav>
                <Link className={"navItems" + (window.location.href.split("/")[4] === "dashboard" ? " --active" : "")} to="/dashboard">Dashboard</Link>
                <Link className={"navItems" + (window.location.href.split("/")[4] === "websites" ? " --active" : "")} to="/websites">Websites</Link>
            </nav>
        </>
    )
}