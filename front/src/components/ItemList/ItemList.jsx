import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './ItemList.css';

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
                            itemID={item.item_id}
                            image={item.image}
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
                <Link to={itemURL}>
                    <div className="itemRowImage">
                        <img src={imagen} alt="thumbnail" />
                    </div>
                    <div className="itemRowDescription">
                        <h4>{title}</h4>
                        <p className="itemRowDate">
                            Fecha: {date}
                        </p>
                        <h2>$ {precio}</h2>
                        <p className="itemRowUbication">
                            Ubicacion: {ciudad} - {estado} - {pais}
                        </p>
                    </div>
                </Link>
            </div>
        );
    }
}

export default ItemList;
