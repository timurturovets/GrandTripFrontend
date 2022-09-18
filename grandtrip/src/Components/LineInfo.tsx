import React, { Component } from 'react'

interface LinesListProps {
    id: number,
    onHighlighted: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => void,
    onDeleted: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => void
}
export default class LinesList extends Component<LinesListProps, any> { 
    render() {
        const { id, onHighlighted, onDeleted } = this.props;

        return <div>
            <h3 className="text-light">Линия {id}</h3>
            <button onClick={e => onHighlighted(e, id)}>Подсветить</button>
            <button onClick={e => onDeleted(e, id)}>Удалить</button>
        </div>
    }
}