const Fetch = async (url, method, headers, body, signal) => {
    const t = fetch(url, { method: method, headers, body, signal } ).then((res) => res.json());
    return t;
}

export default Fetch;