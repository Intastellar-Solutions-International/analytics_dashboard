const Fetch = async (url, method, headers, body, signal) => {
    const t = fetch(url, { method: method, headers, body, signal } ).then((res) => {
        if (res.status === 401) {
            return "Err_Login_Expired";
        } else if (res.status === 403) {
            return "Err_No_Permission";
        } else if (res.status === 404) {
            return "Err_Not_Found";
        } else if (res.status === 500) {
            return "Err_Server_Error";
        } 

        return res.json();
    } );
    return t;
}

export default Fetch;