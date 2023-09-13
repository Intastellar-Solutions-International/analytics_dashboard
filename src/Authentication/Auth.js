const Authentication = {
    Login: function (url, email, password, type, setErrorMessage, setLoading) {
        setLoading(true);
        fetch(url, {
            withCredentials: false,
            method: "POST",
            headers: {
                'LoginType': 'employee',
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                type: type
            })
        }).then((response) => {
            return response.json();
        }).then(response => {
            if (response === "Err_Logon_Fail") {
                setErrorMessage("We having trouble to log you in");
                return;
            }

            if (response === "Err_Logon_Deny") {
                setErrorMessage("Your account has been locked due to too many incorrect password attempts – please contact your Alsense Account Manager for assistance");
                return;
            }
            setLoading(false);

            localStorage.setItem("globals", JSON.stringify(response));
            if (window.location.href === "login") {
                window.location.href = "/dashboard";
            } else {
                window.location.reload();
            }

        })
    },
    Logout: function () {
        localStorage.removeItem("globals");
        window.location.reload();
    },
    getToken: function () {
        const token = (JSON.parse(localStorage.getItem("globals"))?.token) ? "Bearer " + JSON.parse(localStorage.getItem("globals"))?.token : undefined;
        return  token;
    },
    getUserId: function () {
        const email = (JSON.parse(localStorage.getItem("globals"))?.profile?.email) ? JSON.parse(localStorage.getItem("globals"))?.profile?.email : undefined;
        return  email;
    },
    getOrganisation: function(){
        const organisation = (JSON.parse(localStorage.getItem("organisation")).id) ? JSON.parse(localStorage.getItem("organisation"))?.id : undefined;
        return organisation;
    }
}

export default Authentication;