import React, { Component } from 'react'
import Dot from '../Interfaces/Dot'

type NextBack = 'next' | 'back'
type Position = 'none' | 'first' | 'last'

interface WalkthroughDotProps {
    dot: Dot
    position: Position
    onNext: (type: NextBack) => void
}

export default class WalkthroughDot extends Component<WalkthroughDotProps, any> {
    render() {
        const { dot, position } = this.props;
        return <div>
            <h3>{dot.name}</h3>
            <p>{dot.description}</p>
            <div>
                <button className="btn btn-outline-primary btn-large"
                disabled={position==='first'} onClick={e=>this.handleNext(e, 'back')}>
                    К предыдущей точке
                </button>
                <button className="btn btn-outline-primary btn-large"
                disabled={position==='last'} onClick={e=>this.handleNext(e, 'next')}>
                    К следующей точке
                </button>
            </div>
        </div>
    }

    handleNext = (e: React.MouseEvent<HTMLButtonElement>, type: NextBack) => {
        e.preventDefault();

        this.props.onNext(type);
    }
}