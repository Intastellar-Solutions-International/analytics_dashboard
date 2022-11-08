import "./App.css";
import Header from "./components/header/header";
import Login from "./Login/Login";
import Nav from "./components/header/Nav";
const Router = window.ReactRouterDOM.BrowserRouter;
const Route =  window.ReactRouterDOM.Route;
const Link =  window.ReactRouterDOM.Link;
const Prompt =  window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;
const { useState, useEffect } = React;

import Dashboard from "./pages/Dashboard/Dashboard.js";
export default function App() {

    if (JSON.parse(localStorage.getItem("globals"))?.token !== undefined) {
        return (
            <>
                <Router>
                    <Header />
                    {/* <Nav /> */}
                    <Switch>
                        <Route path="/dashboard" exact>
                            <Dashboard />
                        </Route>
                        <Route path="/websites">

                        </Route>
                        <Redirect to="/dashboard" />
                    </Switch>
                </Router>
            </>
        )
    } else {
        return (
            <Router>
                <Login />
            </Router>
        )
    }
}