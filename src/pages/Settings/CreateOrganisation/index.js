import Fetch from "../../../functions/fetch";
import API from "../../../API/api";
const { useState, useEffect, useRef } = React;
const Link = window.ReactRouterDOM.Link;
export default function AddUser() {
    const [organisationName, setOrganisationName] = useState("");
    const create = (e) => {
        e.preventDefault();
        console.log(e);
    };

    return (
        <>
            <main className="dashboard-content">
                <h1>Create a Organisation</h1>
                <Link to="/settings">Back to settings</Link>
                <form onSubmit={create}>
                    <label for="orgName">Organisation Name</label><br />
                    <input id="orgName" autoComplete="off" onChange={(e) => setOrganisationName(e.target.value)} />
                </form>
            </main>
        </>
    )
}