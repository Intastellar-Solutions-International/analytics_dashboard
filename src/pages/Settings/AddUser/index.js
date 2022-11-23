import { OrganisationContext } from "../../../App";
import Fetch from "../../../functions/fetch";
import API from "../../../API/api";
import SuccessWindow from "../../../components/SuccessWindow";
const Link = window.ReactRouterDOM.Link;
const { useState, useEffect, useRef, useContext } = React;
export default function AddUser() {
    const [Organisation, setOrganisation] = useContext(OrganisationContext);
    const [userMail, setUserMail] = useState("");
    const [userRole, setUserRole] = useState("Admin");
    const [userName, setUserName] = useState("");
    const [status, setStatus] = useState(null);

    const addUser = (e) => {
        e.preventDefault();
        setStatus("Loading...");
        Fetch(API.settings.addUser.url, API.settings.addUser.method,
            API.settings.addUser.headers,
            JSON.stringify(
                {
                    organisationId: Organisation?.id,
                    userEmail: userMail,
                    userRole: userRole
                }
            )
        ).then(
            (re) => {
                setStatus(null);
                if (re == "ERROR_CREATING_ORGANISATION" || re === "Err_Token_Not_Found") return;
                setStatus(`User ${userName} added to ${Organisation?.name}`);
            }
        )
    };

    return (
        <>
            <main className="dashboard-content">
                <h1>Add user for { Organisation?.name }</h1>
                <Link to="/settings">Back to settings</Link>
                <SuccessWindow style={{rgiht: "-100%"}} message={`User Felix Schultz added to ${Organisation?.name}`} />
                <form onSubmit={addUser}>
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name" onChange={(e) => setUserName(e.target.value)}/>
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" onChange={(e) => setUserMail(e.target.value)} />
                    <label for="role">Role</label>
                    <select id="role" name="role" onChange={(e) => setUserRole(e.target.value)}>
                        <option>Admin</option>
                        <option>Manager</option>
                    </select>
                    <button>Add user</button>
                </form>
            </main>
        </>
    )
}