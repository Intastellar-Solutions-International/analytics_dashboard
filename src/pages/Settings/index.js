import "./Style.css";
const Link = window.ReactRouterDOM.Link;
export default function Settings(props) {
    return (
        <>
            <main className="dashboard-content">
                <h1>Settings</h1>
                <Link to="/settings/add-user">Add user</Link>
                <Link to="/settings/create-organisation">Create Organisation</Link>
            </main>
        </>
    )
}