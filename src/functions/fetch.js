const Fetch = async (url, method) => {
    const t = fetch(url, { method: method}).then((res) => res.json());
    return t;
}

export default Fetch;