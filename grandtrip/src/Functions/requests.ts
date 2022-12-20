interface Headers {
    "Authorization"?: string,
    "Content-Type"?: string
}

const request = async(url: string, method: 'get' | 'post', 
    params?: any) : Promise<any> => {
    let options: RequestInit = {
        method
    };

    const headers: Headers = { }
    const token = localStorage.getItem('token');
    if(token) headers["Authorization"] = `Bearer ${token}`;

    if(method === "get") url += "?" + (new URLSearchParams(params as string)).toString()
    else options.body = params as FormData;    

    options.headers = headers as HeadersInit;
    return await fetch(url, options);
}

export const get = (url: string, params?: any) : Promise<any> => request(url, "get", params);
export const post = (url: string, params?: FormData) : Promise<any> => request(url, "post", params);