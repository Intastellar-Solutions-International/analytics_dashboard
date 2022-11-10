const Fetch = async (url, method, headers) => {
    const t = fetch(url, { method: method, headers }).then((res) => res.json());
    return t;
}

export default Fetch;