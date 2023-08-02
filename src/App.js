import "./App.css";
import Header from "./Components/Header/header";
import Login from "./Login/Login";
import Nav from "./Components/Header/Nav";
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

export const OrganisationContext = createContext(null);
export const DomainContext = createContext(null);

export default function App() {

    const [dashboardView, setDashboardView] = useState("GDPR Cookiebanner");
    const [organisation, setOrganisation] = useState(null);
    const [currentDomain, setCurrentDomain] = useState("all");

    
    if (JSON.parse(localStorage.getItem("globals"))?.token !== undefined || JSON.parse(localStorage.getItem("globals"))?.status) {
        if (window.location.href.indexOf("login") > -1) {
            window.location.href = "/dashboard";
        }
        return (
            <>
                <Router>
                    <OrganisationContext.Provider value={ [organisation, setOrganisation] }>
                        <DomainContext.Provider value={ [currentDomain, setCurrentDomain]}>
                            <Header />
                            <div className="main-grid"> 
                                <Nav />
                                <Switch>
                                    <Route path="/dashboard" exact>
                                        <Dashboard dashboardView={dashboardView} setDashboardView={setDashboardView} />
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
                                    <Router path="/login" exact>
                                        <LoginOverLay />
                                    </Router>
                                    <Redirect to="/login" />
                                </Switch>
                            </div>
                        </DomainContext.Provider>
                    </OrganisationContext.Provider>
                </Router>
            </>
        )
    } else if(JSON.parse(localStorage.getItem("globals"))?.status == undefined || JSON.parse(localStorage.getItem("globals"))?.status != "admin") {
        return (
            <Router path="/login" exact>
                <Login />
            </Router>
        )
    }
}