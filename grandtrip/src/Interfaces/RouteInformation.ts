import Line from './Line'
import Dot from './Dot'

export default interface RouteInformation {
    id: number,
    name: string,
    description: string,
    lines: Line[],
    dots: Dot[],
    author: string,
    theme: string,
    season: string
}