const Link = window.ReactRouterDOM.Link;
export default function SideNav(props) {
    const useLocation = window.ReactRouterDOM.useLocation;
    return <>
        <aside className="sidebar expand">
            <nav className="collapsed expand">
                {
                    props?.links?.map((link) => {
                        return <Link className={"navItems" + (useLocation().pathname === link?.path ? " --active" : "")} to={link?.path}><i className={"dashboard-icons " + link?.icon}></i> <span className="hiddenCollapsed">{link?.name}</span></Link>
                    })
                }
            </nav>
        </aside>
    </>
}