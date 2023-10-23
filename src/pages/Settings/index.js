import "./Style.css";
import SideNav from "../../Components/Header/SideNav";
const { useState, useEffect, useRef } = React;
const Link = window.ReactRouterDOM.Link;
const useParams = window.ReactRouterDOM.useParams;
export default function Settings(props) {
    document.title = "Settings | Intastellar Analytics";
    const { handle, id } = useParams();
    const reportsLinks = [
        {
            name: "Add new User",
            path: "/settings/add-user",
            view: ["admin", "super-admin"]
        },
        {
            name: "Create new Organisation",
            path: "/settings/create-organisation",
            view: ["admin", "super-admin"]
        },
        {
            name: "View Organisations",
            path: "/settings/view-organisations",
            view: ["admin", "super-admin", "user", "manager"]
        }
    ]
    return (
        <>
            <SideNav links={reportsLinks} />
            <main className="dashboard-content">
                <h1>Settings</h1>
            </main>
        </>
    )
}