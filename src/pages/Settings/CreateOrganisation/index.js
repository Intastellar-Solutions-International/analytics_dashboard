import Fetch from "../../../functions/fetch";
import { OrganisationContext } from "../../../App";
import API from "../../../API/api";
const { useState, useEffect, useRef, useContext } = React;
const Link = window.ReactRouterDOM.Link;
export default function AddUser() {
    const [organisationName, setOrganisationName] = useState("");
    const [organisationAdmin, setOrganisationAdmin] = useState("");

    const [status, setStatus] = useState(null);
    const create = (e) => {
        e.preventDefault();
        setStatus("Loading...");
        Fetch(API.settings.createOrganisation.url, API.settings.createOrganisation.method,
            API.settings.createOrganisation.headers,
            JSON.stringify(
                {
                    organisationName: organisationName,
                    organisationMember: organisationAdmin
                }
            )
        ).then(
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
                    <input type="text" id="orgName" autoComplete="off" onChange={(e) => setOrganisationName(e.target.value)} /> <br />
                    <label for="MemberName">Admin Email</label><br />
                    <input type="email" id="MemberName" autoComplete="off" onChange={(e) => setOrganisationAdmin(e.target.value)} /> <br />
                    <button type="submit">Create Organisation</button>
                </form>
            </main>
        </>
    )
}