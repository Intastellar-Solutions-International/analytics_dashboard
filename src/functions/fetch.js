const FetchData =  async (url, method) => {
    const response = await fetch(url, {
        method: method
    });

    const json = await response.json();

    return json;
}

export default FetchData;