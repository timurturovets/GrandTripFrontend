import React, { Component } from 'react'
import Dot from '../Interfaces/Dot'
import DotInfo from './DotInfo'

interface DotsListProps {
    dots: Dot[],
    onDotDeleted: (id: number) => void,
    onDotUpdated: (id: number, field: string, value: string) => void
}
export default class DotsList extends Component<DotsListProps, any> {
    render() {
        const { dots } = this.props;
        return <div>
        <h2 className="text-light">Список точек</h2>
        {dots.map(dot=>
            <div key={dot.PositionX+dot.PositionY}>
                <DotInfo 
                    id={dot.id}
                    name={dot.name}
                    desc={dot.desc}
                    link={dot.link}
                    posX={dot.PositionX}
                    posY={dot.PositionY}
                    onDeleted={this.handleDotDeleted}
                    onFieldChanged={this.handleDotFieldChanged}
                />
                <hr />
                </div>)
        }
        {dots.length < 1 && <h3 className="text-light">Вы ещё не поставили ни одной точки.</h3>}
            </div>    
    }

    
    handleDotDeleted = (id: number) => {
        this.props.onDotDeleted(id);
    }

    handleDotFieldChanged = (id: number, field: string, value: string) => {
        this.props.onDotUpdated(id, field, value);
    }
}