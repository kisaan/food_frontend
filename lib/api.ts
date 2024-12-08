const API_BASE_URL = 'http://localhost:8000/api';

export async function apiFetch(
    endpoint: string,
    options: RequestInit = {}
): Promise<any> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        credentials: 'include',
    });

    let responseBody;

    try {
        responseBody = await response.json();
    } catch (err) {
        responseBody = null; 
    }
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('user'); 
            sessionStorage.removeItem('user');

            window.location.href = '/login';
        }

        const errorMessage = responseBody?.message || 'Something went wrong';
        throw new Error(errorMessage);
    }

    return responseBody;
}
