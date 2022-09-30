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
        <h1 className="text-light">Список точек</h1>
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
            </div>    
    }

    
    handleDotDeleted = (id: number) => {
        this.props.onDotDeleted(id);
    }

    handleDotFieldChanged = (id: number, field: string, value: string) => {
        this.props.onDotUpdated(id, field, value);
    }
}