import React, { Component } from 'react'

interface DotInfoProps {
    id: number,
    name: string,
    desc: string,
    link: string,
    posX: number,
    posY: number,
    onDeleted: (id: number) => void,
    onFieldChanged: (id: number, field: string, value: string) => void
}

interface DotInfoState {
    name: string,
    desc: string,
    link: string,
}

export default class DotInfo extends Component<DotInfoProps, DotInfoState> { 
    constructor(props: DotInfoProps) {
        super(props);

        this.state = {
            ...props
        };
    }
    render() {
        const { id, /*posX, posY */} = this.props;
        
        const { name, desc, link } = this.state;
        return <div id={`${id}`}>
                <h3>Точка {id}</h3>
                <div className="form-group">
                    <input className="form-control" type="text" name="dotName" placeholder="Название точки"
                        defaultValue={name} onChange={e=>this.onChange(e, "name")} />
                </div>
                <div className="form-group">
                    <input className="form-control" type="text" name="dotDesc" placeholder="Описание точки"
                        defaultValue={desc} onChange={e=>this.onChange(e, "desc")} />
                </div>
                <div className="form-group">
                    <input className="form-control" type="text" name="dotLink" placeholder="Ссылка на страницу с описанием"
                        defaultValue={link} onChange={e=>this.onChange(e, "link")} />
                </div>
                {/*<div className="form-group">
                    <p className="text-light">Долгота: {posX}</p>
                    <p className="text-light">Широта: {posY}</p>
                </div>*/}
                <button onClick={e=>this.onDelete(e)} className="button button--small sidebar__element">Удалить точку</button>
            </div>
    }

    onDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        const { id, onDeleted } = this.props;
        onDeleted(id);
    }
    onChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        e.preventDefault();

        const { id } = this.props;
        const { value } = e.target;
        this.props.onFieldChanged(id, field, value);
    }
}