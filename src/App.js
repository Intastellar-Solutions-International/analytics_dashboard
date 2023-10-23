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
import FerryDashboard from "./Pages/Dashboard/ferry/Dashboard.js";
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
import ErrorBoundary from "./Components/Error/ErrorBoundary";
import Countries from "./Pages/Countries/Countries";
import BugReport from "./Components/BugReport/BugReport";
import PlatformSelector from "./Components/PlatformSelector/PlatformSelector";

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
    const [id, setId] = useState((localStorage.getItem("platform")) ? localStorage.getItem("platform") : null);
    if (localStorage.getItem("globals") && JSON.parse(localStorage.getItem("globals"))?.token != undefined || JSON.parse(localStorage.getItem("globals"))?.status) {
        /* const [domainLoadings, data, error, getUpdated] = useFetch(null, API[id].getDomains.url, API[id].getDomains.method, API[id].getDomains.headers); */
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

            if(id && API[id]?.getDomains?.url != undefined){
                Fetch(API[id].getDomains.url, API[id].getDomains.method, API[id].getDomains.headers).then((data) => {
                    
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
            }

        }, []);

        if(id === null){
            return (
                <>
                    <PlatformSelector setId={setId} platforms={JSON.parse(localStorage.getItem("globals"))?.access?.type} />
                    <BugReport />
                </>
            )
        }

        return (
            <>
                <Router>
                    <OrganisationContext.Provider value={ [organisation, setOrganisation] }>
                        <DomainContext.Provider value={ [currentDomain, setCurrentDomain] }>
                            <ErrorBoundary>
                                <Header handle={handle} id={id} />
                                <BugReport />
                            </ErrorBoundary>
                            <div className="main-grid"> 
                                <Nav />
                                <Switch>
                                    <Route path="/:id/dashboard" exact>
                                        <div style={{flex:"1"}}>
                                            <section style={{padding: "40px", backgroundColor: "rgb(218, 218, 218)", color: "#626262"}}>
                                                <h1>Welcome, {JSON.parse(localStorage.getItem("globals"))?.profile?.name?.first_name}</h1>
                                                <p>Here you can see all the data regarding your GDPR cookiebanner implementation of your organisation</p>
                                            </section>
                                            {domainError ? <AddDomain /> : 
                                            <ErrorBoundary>
                                                {(id == "gdpr") ? <Dashboard dashboardView={dashboardView} setDashboardView={setDashboardView} /> : <FerryDashboard />}
                                            </ErrorBoundary>
                                            }
                                        </div>
                                    </Route>
                                    <Route path="/:id/domains" exact>
                                        <ErrorBoundary>
                                            {domainError ? <AddDomain /> : <Websites />}
                                        </ErrorBoundary>
                                    </Route>
                                    <Route path="/settings" exact>
                                        <ErrorBoundary>
                                            {domainError ? <AddDomain /> : <Settings />}
                                        </ErrorBoundary>
                                    </Route>
                                    <Route path="/settings/create-organisation">
                                        <ErrorBoundary>
                                            {Authentication.User.Status === "admin" || Authentication.User.Status === "super-admin" ? <CreateOrganisation /> : null}
                                        </ErrorBoundary>
                                    </Route>
                                    <Route path="/settings/add-user">
                                        <ErrorBoundary>
                                            {Authentication.User.Status === "admin" || Authentication.User.Status === "super-admin" ? <AddUser /> : null}
                                        </ErrorBoundary>
                                    </Route>
                                    <Route path="/settings/view-organisations">
                                        <ErrorBoundary>
                                            {domainError ? <AddDomain /> : <ViewOrg />}
                                        </ErrorBoundary>
                                    </Route>
                                    <Route path='/:id/view/:handle'>
                                        <ErrorBoundary>
                                            {domainError ? <AddDomain /> : <DomainDashbord setHandle={setHandle} />}
                                        </ErrorBoundary>
                                    </Route>
                                    <Route path="/:id/reports" exact>
                                        <ErrorBoundary>
                                            <Reports />
                                        </ErrorBoundary>
                                    </Route>
                                    <Route path="/:id/reports/user-consents">
                                        <ErrorBoundary>
                                            {domainError ? <AddDomain /> : <UserConsents organisations={organisations} />}
                                        </ErrorBoundary>
                                    </Route>
                                    <Route path="/:id/reports/countries">
                                        <ErrorBoundary>
                                            {domainError ? <AddDomain /> : <Countries organisations={organisations} />}
                                        </ErrorBoundary>
                                    </Route>
                                    <Route path="/dashboard">
                                        <ErrorBoundary>
                                            <PlatformSelector setId={setId} platforms={JSON.parse(localStorage.getItem("globals"))?.access?.type} />
                                        </ErrorBoundary>
                                    </Route>
                                    <Router path="/login" exact>
                                        <ErrorBoundary>
                                            <Login />
                                        </ErrorBoundary>
                                    </Router>
                                    <Redirect to="/login" />
                                </Switch>
                            </div>
                        </DomainContext.Provider>
                    </OrganisationContext.Provider>
                </Router>
            </>
        )
    } else if(!localStorage.getItem("globals") || window.location.pathname === "/login") {
        
        return (
            <Login />
        )
    }
}