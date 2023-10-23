const Link = window.ReactRouterDOM.Link;
const useParams = window.ReactRouterDOM.useParams;
export default function SideNav(props) {
    const useLocation = window.ReactRouterDOM.useLocation;
    const { handle, id } = useParams();
    let url = "";

    return <>
        <aside className="sidebar expand">
            <nav className="collapsed expand">
                {
                    props?.links?.map((link, key) => {
                        if(link.path.indexOf("reports") !== -1){
                            url = "/" + id + link?.path;
                        }else {
                            url = link?.path;
                        }
                        return <Link key={key} className={"navItems" + (useLocation()?.pathname === link?.path ? " --active" : "")} to={url}>{link?.icon ? <i className={"dashboard-icons " + link?.icon}></i> : null} <span className="hiddenCollapsed">{link?.name}</span></Link>
                    })
                }
            </nav>
        </aside>
    </>
}