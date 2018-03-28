import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './ItemList.css';
import strings         from '../../lang/languajes';
import PropTypes       from 'prop-types';

class ItemList extends Component {
    render() {
        let data = this.props.data;
        console.log(data);
        return(
            <div>
                {
                    data.map((item, index) =>
                        <ItemRow
                            key={index}
                            index={index}
                            itemID={item.id}
                            image={item.pictures[0].url}
                            title={item.title}
                            city={item.city}
                            state={item.state}
                            country={item.country}
                            price={item.price}
                            date={item.date_created}
                        />
                    )
                }
            </div>
        );
    }
}

class ItemRow extends Component {
    render() {
        const lang = strings[this.context.language];
        let id       = this.props.itemID;
        let imagen   = this.props.image;
        let title    = this.props.title;
        let ciudad   = this.props.city;
        let estado   = this.props.state;
        let pais     = this.props.country;
        let precio   = this.props.price;
        let index    = this.props.index;
        let date     = this.props.date;
        let itemURL  = "/items/" + id;
        let timeMultiplier = 0.1;

        return(
            <div className="itemRow" style={{"--time": (index * timeMultiplier)  + "s"}}>
                <a href={itemURL}>
                    <div className="itemRowImage">
                        <img src={imagen} alt="thumbnail" />
                    </div>
                    <div className="itemRowDescription">
                        <h4>{title}</h4>
                        <p className="itemRowDate">
                            {lang.principal.fecha}: {date}
                        </p>
                        <h2>$ {precio}</h2>
                        <p className="itemRowUbication">
                            {lang.principal.ubicacion}: {ciudad} - {estado} - {pais}
                        </p>
                    </div>
                </a>
            </div>
        );
    }
}

ItemRow.contextTypes = {
    language: PropTypes.string
};

export default ItemList;
