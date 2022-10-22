import { get } from './requests'

export const getRouteById = (id: number) => get(`${process.env.REACT_APP_API_URL}/get_route`, { id: id });