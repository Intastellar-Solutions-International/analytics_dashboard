import "./Style.css";
const { useState, useEffect, useRef } = React;
const Link = window.ReactRouterDOM.Link;
const useParams = window.ReactRouterDOM.useParams;
export default function Settings(props) {
    document.title = "Settings | Intastellar Analytics";
    const { handle, id } = useParams();
    return (
        <>
            <main className="dashboard-content">
                <h1>Settings</h1>
                <nav>
                    <Link className="settingsNavItem" to={"/settings/add-user"}>Add user</Link>
                    <Link className="settingsNavItem" to={"/settings/create-organisation"}>Create Organisation</Link>
                    <Link className="settingsNavItem" to={"/settings/view-organisations"}>View Organisations</Link>
                </nav>
            </main>
        </>
    )
}