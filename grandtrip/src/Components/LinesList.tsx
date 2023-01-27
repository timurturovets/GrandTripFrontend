import React, { Component } from 'react'
import Line from '../Interfaces/Line'
import LineInfo from './LineInfo'

interface LinesListProps {
    lines: Line[],
    onLineDeleted: (id: number) => void,
    onLineHighlighted: (id: number) => void
}
export default class LinesList extends Component<LinesListProps, any> { 

    render() {
        const { lines } = this.props;
        return <div>
            <h2>Список линий</h2>
            <div>
                {lines.map(line=>{
                    return <div key={line.id}>
                        <LineInfo
                            id={line.id}

                            onDeleted={this.handleLineDelete}
                            onHighlighted={e=>this.handleLineHighlight(e, line.id)} />
                    </div>
                })}
                {lines.length < 1 && <h6>Вы ещё не провели ни одну линию.</h6>}
            </div>
        </div>
    }

    handleLineDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => {
        e.preventDefault();

        this.props.onLineDeleted(id);
    }

    handleLineHighlight = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => {
        e.preventDefault();

        this.props.onLineHighlighted(id);
    }
}