const Fetch = async (url, method, headers, body) => {
    const t = fetch(url, { method: method, headers, body } ).then((res) => res.json());
    return t;
}

export default Fetch;