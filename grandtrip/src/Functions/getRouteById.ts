import { get } from './requests'

export const getRouteById = (id: number) => get("http://localhost:8081/get_route", { id: id });