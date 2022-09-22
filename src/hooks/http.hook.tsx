import {useState, useCallback} from 'react'

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (url: string, method = 'GET', body: any = null, headers: any = {}, isResponseJson = true) => {
        setLoading(true);
        try {
            if (isResponseJson) {
                if (body) {
                    body = JSON.stringify(body);
                    headers['Content-Type'] = 'application/json';
                }
                const response = await fetch(url, {method, body, headers});
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'something is wrong, please try again');
                }
                setLoading(false);
                return data;
            } else {
                const response = await fetch(url, {method});
                setLoading(false);
                return response;
            }
        } catch (e: any) {
            setLoading(false);
            setError(e.message);
            throw e;
        }
    }, [])

    const clearError = useCallback(() => setError(null), []);

    return {loading, request, error, clearError}
}
