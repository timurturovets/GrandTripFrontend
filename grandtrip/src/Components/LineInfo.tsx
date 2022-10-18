import React, { Component } from 'react'

interface LineInfoProps {
    id: number,
    onHighlighted: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => void,
    onDeleted: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => void
}

export default class LineInfo extends Component<LineInfoProps, any> { 
    render() {
        const { id, onHighlighted, onDeleted } = this.props;

        return <div>
            <h3 className="text-light">Линия {id}</h3>
            <button onClick={e => onHighlighted(e, id)} 
            className="constructor-button" style={{width: '50%'}}>
                Подсветить</button>
            <button onClick={e => onDeleted(e, id)}
            className="constructor-button" style={{width: '50%'}}>
                Удалить</button>
        </div>
    }
}