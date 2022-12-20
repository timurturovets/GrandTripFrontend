import { get } from './requests'

/*export const getRouteById = (id: number) => get(`${process.env.REACT_APP_API_URL}/get_route`, { id: id })
    .then(async response=> await response.json());*/
    
export const getRouteById = (id: number) => get(`${process.env.REACT_APP_NEW_API_URL}/api/route/get`, { id })
.then(async response=> (await response.json()).route);