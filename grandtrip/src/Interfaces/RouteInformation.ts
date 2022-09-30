import Line from './Line'
import Dot from './Dot'

export default interface RouteInformation {
    id: number,
    routeName: string,
    routeDesc: string,
    lines: Line[],
    dots: Dot[],
}