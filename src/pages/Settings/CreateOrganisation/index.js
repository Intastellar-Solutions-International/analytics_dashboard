import Fetch from "../../../functions/fetch";
import API from "../../../API/api";
const { useState, useEffect, useRef } = React;
export default function AddUser() {
    const [organisationName, setOrganisationName] = useState("");
    const create = () => {

    };

    return (
        <>
            <main className="dashboard-content">
                <h1>Create a Organisation</h1>
                <form onSubmit={create}>
                    <label for="orgName">Organisation Name</label><br />
                    <input id="orgName" onChange={(e) => setOrganisationName(e.target.value)} />
                </form>
            </main>
        </>
    )
}