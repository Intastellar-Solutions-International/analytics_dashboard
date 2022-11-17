import Fetch from "../../../functions/fetch";
import API from "../../../API/api";
const { useState, useEffect, useRef } = React;
const Link = window.ReactRouterDOM.Link;
export default function ViewOrg() {
    return (
        <>
            <main className="dashboard-content">
                <h1>Organisations</h1>
                <Link to="/settings">Back to settings</Link>
            </main>
        </>
    )
}