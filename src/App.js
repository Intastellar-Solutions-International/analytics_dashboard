import "./App.css";
import Header from "./Components/Header/header";
import Login from "./Login/Login";
import Nav from "./Components/Header/Nav";
import API from "./API/api";
import useFetch from "./Functions/FetchHook";
const { useState, useEffect, useRef, createContext } = React;
const Router = window.ReactRouterDOM.BrowserRouter;
const Route =  window.ReactRouterDOM.Route;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;
const punycode = require("punycode");

import Dashboard from "./Pages/Dashboard/Dashboard.js";
import Websites from "./Pages/Domains/index.js";
import Settings from "./Pages/Settings";
import CreateOrganisation from "./Pages/Settings/CreateOrganisation";
import AddUser from "./Pages/Settings/AddUser";
import ViewOrg from "./Pages/Settings/ViewOrganisations";
import LoginOverLay from "./Login/LoginOverlay";
import DomainDashbord from "./Pages/Dashboard/DomainDashbord";
import Fetch from "./Functions/fetch";
import AddDomain from "./Components/AddDomain/AddDomain";
import Select from "./Components/SelectInput/Selector";
import Authentication from "./Authentication/Auth";
import UserConsents from "./Pages/UserConsents/UserConsents";
import Reports from "./Pages/Reports/Reports";


export const OrganisationContext = createContext(localStorage.getItem("organisation"));
export const DomainContext = createContext(null);

export default function App() {
    const [dashboardView, setDashboardView] = useState("GDPR Cookiebanner");
    const [organisation, setOrganisation] = useState((localStorage.getItem("organisation")) ? localStorage.getItem("organisation") : null);
    const [currentDomain, setCurrentDomain] = useState("all");
    const [handle, setHandle] = useState(null);
    const [organisations, setOrganisations] = useState(null);
    const [domains, setDomains] = useState(null);
    const [domainError, setDomainError] = useState(false);

    if (JSON.parse(localStorage.getItem("globals"))?.token != undefined || JSON.parse(localStorage.getItem("globals"))?.status) {
        if(window.location.href.indexOf("/login") > -1){
            window.location.href = "/dashboard";
        }

        /* const [domainLoadings, data, error, getUpdated] = useFetch(null, API.gdpr.getDomains.url, API.gdpr.getDomains.method, API.gdpr.getDomains.headers); */

        useEffect(() => {
            Fetch(API.settings.getOrganisation.url, API.settings.getOrganisation.method, API.settings.getOrganisation.headers, JSON.stringify({
                organisationMember: Authentication.getUserId()
            })).then((data) => {
                if (data === "Err_Login_Expired") {
                    localStorage.removeItem("globals");
                    navigate.push("/login");
                    return;
                }
                
                setOrganisations(data);
            });

            Fetch(API.gdpr.getDomains.url, API.gdpr.getDomains.method, API.gdpr.getDomains.headers).then((data) => {
                
                if(data.error === "Err_No_Domains") {
                    setDomainError(true);
                }else{
                    data.unshift({domain: "all", installed: null, lastedVisited: null});
                    data?.map((d) => {
                        return  punycode.toUnicode(d.domain);
                    }).filter((d) => {
                        return d !== undefined && d !== "" && d !== "undefined.";
                    });
                    setDomains(data);
                }
            });

        }, []);

        return (
            <>
                <Router>
                    <OrganisationContext.Provider value={ [organisation, setOrganisation] }>
                        <DomainContext.Provider value={ [currentDomain, setCurrentDomain] }>
                            <Header handle={handle} />
                            <div className="main-grid"> 
                                <Nav />
                                <Switch>
                                    <Route path="/dashboard" exact>
                                        <div>
                                        <section style={{padding: "40px", backgroundColor: "rgb(218, 218, 218)", color: "#626262"}}>
                                            <h1>Welcome, {JSON.parse(localStorage.getItem("globals")).profile.name.first_name}</h1>
                                            <p>Here you can see all the data regarding your GDPR cookiebanner implementation of your organisation</p>
                                            <h2 style={{display: "flex"}}>Organisation: {
                                                <Select style={{marginLeft: "10px"}} defaultValue={organisation}
                                                onChange={(e) => { 
                                                    setOrganisation(e);
                                                    localStorage.setItem("organisation", e);
                                                    window.location.reload();}}
                                                items={organisations} title="Choose one of your domains"/>
                                            }</h2>
                                        </section>
                                        {domainError ? <AddDomain /> : <Dashboard dashboardView={dashboardView} setDashboardView={setDashboardView} />

                                        }
                                        </div>
                                    </Route>
                                    <Route path="/domains" exact>
                                        {domainError ? <AddDomain /> : <Websites />}
                                    </Route>
                                    <Route path="/settings" exact>
                                        {domainError ? <AddDomain /> : <Settings />}
                                    </Route>
                                    <Route path="/settings/create-organisation">
                                        {domainError ? <AddDomain /> : <CreateOrganisation />}
                                    </Route>
                                    <Route path="/settings/add-user">
                                        {domainError ? <AddDomain /> : <AddUser />}
                                    </Route>
                                    <Route path="/settings/view-organisations">
                                        {domainError ? <AddDomain /> : <ViewOrg />}
                                    </Route>
                                    <Route path='/view/:handle'>
                                        {domainError ? <AddDomain /> : <DomainDashbord setHandle={setHandle} />}
                                    </Route>
                                    <Route path="/reports" exact>
                                        <Reports />
                                    </Route>
                                    <Route path="/user-consents">
                                        <div>
                                            <section style={{padding: "40px", backgroundColor: "rgb(218, 218, 218)", color: "#626262"}}>
                                                <h1>Welcome, {JSON.parse(localStorage.getItem("globals")).profile.name.first_name}</h1>
                                                <p>Here you can see all the data regarding your GDPR cookiebanner implementation of your organisation</p>
                                                <h2 style={{display: "flex"}}>Organisation: {
                                                    <Select style={{marginLeft: "10px"}} defaultValue={organisation}
                                                    onChange={(e) => { 
                                                        setOrganisation(e);
                                                        localStorage.setItem("organisation", e);
                                                        window.location.reload();}}
                                                    items={organisations} title="Choose one of your domains"/>
                                                }</h2>
                                            </section>
                                            {domainError ? <AddDomain /> : <UserConsents />}
                                        </div>
                                    </Route>
                                    <Redirect to="/login" />
                                </Switch>
                            </div>
                        </DomainContext.Provider>
                    </OrganisationContext.Provider>
                </Router>
            </>
        )
    } else if(JSON.parse(localStorage.getItem("globals"))?.token == undefined) {
        return (
            <Router path="/login" exact>
                <Login />
            </Router>
        )
    }
}