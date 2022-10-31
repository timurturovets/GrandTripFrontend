interface Headers {
    "Authorization"?: string,
    "Content-Type"?: string
}

const request = async (url: string, method: string, params?: any) : Promise<any> => {
    let options: RequestInit = {
        method
    };

    const headers: Headers = { }
    const token = localStorage.getItem('token');
    if(token) headers["Authorization"] = `Bearer ${token}`;

    if(method === "GET") {
        url += "?" + (new URLSearchParams(params)).toString()
    } else {
        headers["Content-Type"] = "application/json"
        options.body = JSON.stringify(params);
    }

    options.headers = headers as HeadersInit;
    return await fetch(url, options);
}

export const get = (url: string, params?: any) : Promise<any> => request(url, "GET", params);
export const post = (url: string, params?: any) : Promise<any> => request(url, "POST", params);