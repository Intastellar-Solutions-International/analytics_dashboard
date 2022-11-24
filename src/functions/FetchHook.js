const { useState, useEffect } = React;
export default function useFetch(url, method, headers, body){
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState();
    const [error, setError] = useState();
    
    useEffect(() => {
        const controller = new AbortController();
        setLoading(true)
        fetch(url, { method: method, headers, body, signal: controller.signal } )
            .then((res) => res.json())
            .then(setData)
            .catch(setError)
            .finally(() => {
                setLoading(false);
                /* setUpdated("Now"),
                setLastUpdated(Math.floor(Date.now() / 1000)) */
            });
        return () => {
            controller.abort();
        }
    }, [url]);

    return [loading, data, error];
}