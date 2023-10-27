import "./Style.css";
import SideNav from "../../Components/Header/SideNav";
import { reportsLinks } from "../../Components/Header/SideNavLinks";
const { useState, useEffect, useRef } = React;
const Link = window.ReactRouterDOM.Link;
const useParams = window.ReactRouterDOM.useParams;

export default function Settings(props) {
    document.title = "Settings | Intastellar Analytics";
    const { handle, id } = useParams();
    
    return (
        <>
            <SideNav links={reportsLinks} />
            <main className="dashboard-content">
                <h1>Settings</h1>
            </main>
        </>
    )
}