import React, {Component} from 'react';
import NotFound from '../NotFound/NotFound';
import {Link} from 'react-router-dom';
import './ItemCarrousel.css';
import strings         from '../../lang/languajes';
import PropTypes       from 'prop-types';

class ItemCarrousel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentItemIndex: 0
        }

        this.handleChangeItem = this.handleChangeItem.bind(this);
    }

    handleChangeItem(e) {
        let target     = e.target;
        let direction  = target.getAttribute("direction");
        let index      = this.state.currentItemIndex;
        let data       = this.props.data;

        if (direction === "left") {
            let size = data.length;
            let newIndex = ((index - 1 % size) + size) % size;
            this.setState({
                currentItemIndex: newIndex
            });
        }
        if (direction === "right") {
            let size = data.length;
            let newIndex = ((index + 1 % size) + size) % size;
            this.setState({
                currentItemIndex: newIndex
            });
        }
    }

    render() {

        let currentIndex = this.state.currentItemIndex;
        let item = this.props.data[currentIndex];
        if (item) {
            return(
                <div className="carrouselContainer">
                    <button className="carrouselButton glyphicon glyphicon-chevron-left"
                        style={{"left": -10}} direction="left" onClick={this.handleChangeItem}></button>
                    <button className="carrouselButton glyphicon glyphicon-chevron-right"
                        style={{"right": -10}} direction="right" onClick={this.handleChangeItem}></button>
                    <CarrouselItem
                        itemID={item.id}
                        title={item.title}
                        state={item.state}
                        country={item.country}
                        city={item.city}
                        price={item.price}
                        description={item.description}
                        image={item.pictures[0].url}/>
                </div>
            )
        }
        else {
            return (NotFound);
        }

    }
}

class CarrouselItem extends Component {
    render() {
        const lang = strings[this.context.language];

        let itemID         = this.props.itemID;
        let title          = this.props.title;
        let state          = this.props.state;
        let country        = this.props.country;
        let city           = this.props.city;
        let price          = this.props.price;
        let description    = this.props.description;
        let image          = this.props.image;
        let itemURL        = "/items/" + itemID;

        return(
            <div className="carrouselItem container-fluid">
                <div className="col-xs-6" style={{"overflow": "hidden", "paddingLeft": 0}}>
                    <img className="carrouselItemImage"
                        src={image}
                        alt="imagen"/>
                </div>
                <div className="carrouselItemDetails col-xs-6">
                    <h4>{title}</h4>
                    <h1>${price}</h1>
                    <p className="carrouselItemLocation">
                        {lang.principal.ubicacion}: {city} - {state} - {country}
                    </p>
                    <h3>{lang.principal.descripcion}: </h3>
                    <p className="carrouselItemDescription">
                        {description}
                    </p>
                    <div className="carrouselItemFooter">
                        <Link to={itemURL}>
                            <button className="btnMasInfo">Ver Mas</button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}
CarrouselItem.contextTypes = {
    language: PropTypes.string
};

export default ItemCarrousel;
