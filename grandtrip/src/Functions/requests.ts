const request = async (url: string, method: string, params?: any) : Promise<any> => {
    let options: RequestInit = {
        method
    };

    if(method === "GET") {
        url += "?" + (new URLSearchParams(params)).toString()
    } else {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(params);
    }

    return await fetch(url, options);
}

export const get = (url: string, params?: any) : Promise<any> => request(url, "GET", params);
export const post = (url: string, params?: any) : Promise<any> => request(url, "POST", params);