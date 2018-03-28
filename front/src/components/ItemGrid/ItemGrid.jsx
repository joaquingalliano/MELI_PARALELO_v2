import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './ItemGrid.css';
import PropTypes       from 'prop-types';
import strings from "../../lang/languajes";

class ItemGrid extends Component {
    render() {
        let data = this.props.data;
        return(
            <div>
                {
                    data.map((item, index) =>
                        <ItemCell
                            key={index}
                            index={index}
                            itemID={item.id}
                            image={item.pictures[0].url}
                            title={item.title}
                            city={item.city}
                            state={item.state}
                            country={item.country}
                            price={item.price}
                        />
                    )
                }
            </div>
        );
    }
}

class ItemCell extends Component {
    render() {
        const lang = strings[this.context.language];

        let id       = this.props.itemID;
        let index    = this.props.index;
        let imagen   = this.props.image;
        let title    = this.props.title;
        let ciudad   = this.props.city;
        let estado   = this.props.state;
        let pais     = this.props.country;
        let precio   = this.props.price;
        let itemURL  = "/items/" + id;
        let timeMultiplier = 0.08;

        return(
            <div className="itemBox" style={{"--time": (index * timeMultiplier) + 's'}}>
                <Link to={itemURL}>
                    <div className="itemImage">
                        <img src={imagen} alt="thumbnail" />
                    </div>
                    <div className="itemDescription">
                        <div>
                            <h4>{title}</h4>
                            <p>
                                {lang.principal.ubicacion}: {ciudad} - {estado} - {pais}
                            </p>
                        </div>
                    </div>
                    <div className="itemPrice">
                        ${precio}
                    </div>
                </Link>
            </div>
        );
    }
}

export {
    ItemCell
}
ItemCell.contextTypes = {
    language: PropTypes.string
};

export default ItemGrid;
