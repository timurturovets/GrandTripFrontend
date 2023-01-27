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
        <h2 >Список точек</h2>
        {dots.map(dot=>
            <div key={dot.positionX + dot.positionY}>
                <hr className="bg-dark mt-3 mb-3" />
                <DotInfo 
                    id={dot.id}
                    name={dot.name}
                    desc={dot.description}
                    link={dot.link}
                    posX={dot.positionX}
                    posY={dot.positionY}
                    onDeleted={this.handleDotDeleted}
                    onFieldChanged={this.handleDotFieldChanged}
                />
                </div>)
        }
        {dots.length < 1 && <h6>Вы ещё не поставили ни одной точки.</h6>}
            </div>    
    }

    
    handleDotDeleted = (id: number) => {
        this.props.onDotDeleted(id);
    }

    handleDotFieldChanged = (id: number, field: string, value: string) => {
        this.props.onDotUpdated(id, field, value);
    }
}