import Line from './Line'
import Dot from './Dot'

export default interface RouteInformation {
    id: string,
    name: string,
    desc: string,
    lines: Line[],
    dots: Dot[],
}