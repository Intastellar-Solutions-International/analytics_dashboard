import Fetch from "../../../functions/fetch";
import API from "../../../API/api";
const { useState, useEffect, useRef } = React;
const Link = window.ReactRouterDOM.Link;
export default function AddUser() {
    const [organisationName, setOrganisationName] = useState("");
    const [status, setStatus] = useState(null);
    const create = (e) => {
        e.preventDefault();
        setStatus("Loading...");
        fetch(API.settings.createOrganisation.url, {
            withCredentials: false,
            method: API.settings.createOrganisation.method,
            headers: API.settings.createOrganisation.headers,
            body: JSON.stringify(
                {
                    organisationName: organisationName
                }
            )
        }).then(re => re.json()).then(
            (re) => {
                setStatus(null);
                if (re == "ERROR_CREATING_ORGANISATION" || re === "Err_Token_Not_Found") return;
                setStatus(`Organisation Created with the name: ${organisationName}`);
            }
        )
    };

    return (
        <>
            <main className="dashboard-content">
                <h1>Create a Organisation</h1>
                <Link to="/settings">Back to settings</Link>
                <form onSubmit={create}>
                    <p>{(status != null) ? status : null}</p>
                    <label for="orgName">Organisation Name</label><br />
                    <input id="orgName" autoComplete="off" onChange={(e) => setOrganisationName(e.target.value)} /> <b />
                    <button type="submit">Create Organisation</button>
                </form>
            </main>
        </>
    )
}