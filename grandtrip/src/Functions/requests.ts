const request = async (url: string, method: string, params?: any) : Promise<any> => {
    let options: RequestInit = {
        method
    };

    if(method === "GET") {
        url += "?" + (new URLSearchParams(params)).toString()
    } else options.body = JSON.stringify(params);

    const response = await fetch(url, options);
    return await response.json()
}

export const get = (url: string, params?: any) : Promise<any> => request(url, "GET", params);
export const post = (url: string, params?: any) : Promise<any> => request(url, "POST", params);