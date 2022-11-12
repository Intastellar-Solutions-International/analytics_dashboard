import "./App.css";
import Header from "./components/header/header";
import Login from "./Login/Login";
import Nav from "./components/header/Nav";
const Router = window.ReactRouterDOM.BrowserRouter;
const Route =  window.ReactRouterDOM.Route;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;

import Dashboard from "./pages/Dashboard/Dashboard.js";
import Websites from "./pages/Websites/Websites.js";
export default function App() {

    if (JSON.parse(localStorage.getItem("globals"))?.token !== undefined || JSON.parse(localStorage.getItem("globals"))?.status == "admin") {
        return (
            <>
                <Router>
                    <Header />
                    <div className="main-grid">
                        <Nav />
                        <Switch>
                            <Route path="/dashboard" exact>
                                <Dashboard />
                            </Route>
                            <Route path="/websites" exact>
                                <Websites />
                            </Route>
                            <Redirect to="/login" />
                        </Switch>
                    </div>
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