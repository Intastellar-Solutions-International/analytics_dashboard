import Fetch from "../../../functions/fetch";
import API from "../../../API/api";
const Link = window.ReactRouterDOM.Link;
const { useState, useEffect, useRef } = React;
export default function AddUser() {
    return (
        <>
            <main className="dashboard-content">
                <h1>Add user</h1>
                <Link to="/settings">Back to settings</Link>
                <form>
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name"/>
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" />
                    <label for="role">Role</label>
                    <select id="role" name="role">
                        <option>Admin</option>
                        <option>Manager</option>
                    </select>
                    <button>Add user</button>
                </form>
            </main>
        </>
    )
}