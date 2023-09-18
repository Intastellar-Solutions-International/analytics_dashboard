import "./App.css";
import Header from "./Components/Header/header";
import Login from "./Login/Login";
import Nav from "./Components/Header/Nav";
import API from "./API/api";
const { useState, useEffect, useRef, createContext } = React;
const Router = window.ReactRouterDOM.BrowserRouter;
const Route =  window.ReactRouterDOM.Route;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;

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

export const OrganisationContext = createContext(localStorage.getItem("organisation"));
export const DomainContext = createContext(null);

export default function App() {
    const [dashboardView, setDashboardView] = useState("GDPR Cookiebanner");
    const [organisation, setOrganisation] = useState((localStorage.getItem("organisation")) ? localStorage.getItem("organisation") : null);
    const [currentDomain, setCurrentDomain] = useState("all");
    const [handle, setHandle] = useState(null);
    const [organisations, setOrganisations] = useState(null);

    if (JSON.parse(localStorage.getItem("globals"))?.token != undefined || JSON.parse(localStorage.getItem("globals"))?.status) {
        if(window.location.href.indexOf("/login") > -1){
            window.location.href = "/dashboard";
        }

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
                                            <Dashboard dashboardView={dashboardView} setDashboardView={setDashboardView} />
                                        </div>
                                        
                                    </Route>
                                    <Route path="/domains" exact>
                                        <Websites />
                                    </Route>
                                    <Route path="/settings" exact>
                                        <Settings />
                                    </Route>
                                    <Route path="/settings/create-organisation">
                                        <CreateOrganisation />
                                    </Route>
                                    <Route path="/settings/add-user">
                                        <AddUser />
                                    </Route>
                                    <Route path="/settings/view-organisations">
                                        <ViewOrg />
                                    </Route>
                                    <Route path='/view/:handle'>
                                        <DomainDashbord setHandle={setHandle} />
                                    </Route>
                                    <Route path="/add-domain">
                                        <AddDomain />
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