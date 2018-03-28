import React from 'react';
import Item from './Item/Item';
import {
    Switch,
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import strings         from '../lang/languajes';
import PropTypes       from 'prop-types';

class ItemsApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = { items: [], vista: "lista" };

        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        //localStorage.setItem("user","JUAN PEREZ");
        //localStorage.removeItem("user");
        //localStorage.setItem("categories", "MLA1,MLA4");

        if(localStorage.getItem("user") != null){
            if(localStorage.getItem("categories") != null){
                fetch('http://localhost:7070/items/q=' + localStorage.getItem("categories"))
                    .then((response) => {
                        return response.json()
                    })
                    .then((items) => {
                        this.setState({ items: items })
                    })
            }
        } else {
            fetch('http://localhost:7070/items')
                .then((response) => {
                    return response.json()
                })
                .then((items) => {
                    this.setState({ items: items })
                })
        }

    }

    handleChange(event) {
        this.setState({vista: event.target.value});
    }

    render() {

        if (this.state.items.length > 0) {
            return (
                <div>
                    <label>
                        Visualizar como:
                        <select value={this.state.value} onChange={this.handleChange}>
                            <option value="lista">Lista</option>
                            <option value="grilla">Grilla</option>
                            <option value="individual">Individual</option>
                        </select>
                    </label>
                    <Switch>
                        <Route exact path="/item" component={Item}/>
                    </Switch>

                    <ItemsList listado={this.state.items} vista={this.state.vista}/>
                </div>
            )
        } else {
            return <p className="text-center">Cargando items...</p>
        }
    }
}

class ItemsList extends React.Component {
    render() {
        let nro = 6;
        let cantItems = nro <= this.props.listado.length ? nro : this.props.listado.length;
        let itemsList = [];
        for(let i=0; i<cantItems; i++){
            itemsList.push(this.props.listado[i])
        }

        if(this.props.vista === "grilla") {
            return (
                <div className="container-fluid container containerCuadricula">
                    <div className="card">
                        {
                            itemsList.map((item) => {
                                return <Grilla key={ item.item_id }
                                              title={item.title}
                                              category_id={item.category_id}
                                              city={item.city}
                                              state={item.state}
                                              country={item.country}
                                              available_quantity={item.available_quantity}
                                              price={item.price}
                                              image={item.image}/>
                            })
                        }
                    </div>
                </div>
            )
        }
        else if(this.props.vista === "individual"){
            return (
                <div className="container">
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className="carousel slide media-carousel" id="media">
                                <div className="carousel-inner">
                                {
                                    itemsList.map((item,i) => {
                                        return <Individual key={ item.item_id }
                                                           title={item.title}
                                                           category_id={item.category_id}
                                                           city={item.city}
                                                           state={item.state}
                                                           country={item.country}
                                                           available_quantity={item.available_quantity}
                                                           price={item.price}
                                                           image={item.image}
                                                           index={i} />
                                    })
                                }
                                </div>
                                <a data-slide="prev" href="#media" className="left carousel-control">‹</a>
                                <a data-slide="next" href="#media" className="right carousel-control">›</a>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        else{
            return (
                <div className="container-fluid container centrar">
                    <div className="media-list centrar">
                        {
                            itemsList.map((item) => {
                                return <Lista key={ item.item_id }
                                              itemId={item.item_id}
                                              title={item.title}
                                              category_id={item.category_id}
                                              city={item.city}
                                              state={item.state}
                                              country={item.country}
                                              available_quantity={item.available_quantity}
                                              price={item.price}
                                              image={item.image} />
                            })
                        }
                    </div>
                </div>
            )
        }

    }
}

class ItemImage extends React.Component {
    render() {
        return (
            <img className={this.props.classStyle} width={this.props.ancho} height={this.props.alto} src={this.props.picture} />
        )
    }
}

class Lista extends React.Component{
    render() {
        let itemURL = "/items/" + this.props.itemId;
        return(
            <div className="media media-center itemBox itemListaCentrado">
                <Link to={itemURL}>
                    <div className="itemImage">
                        <ItemImage picture={this.props.image} />
                    </div>
                    <div className="itemDescription">
                        <h4>{this.props.title}</h4>
                        <p>
                            Ubicacion: {this.props.city} - {this.props.state} - {this.props.country}
                            <br/>
                            <span className="label label-info">Precio: ${this.props.price}</span>
                        </p>
                    </div>
                </Link>
            </div>
        )
    }
}

class Grilla extends React.Component{
    render() {
        return(
            <div className="col-md-6 itemBox itemCuadricula">
                <ItemImage picture={this.props.image} classStyle={"card-img-top itemImage"} ancho={120} alto={120}/>
                <div className="card-body itemDescription">
                    <h4>{this.props.title}</h4>
                    <p>
                        Ubicacion: {this.props.city} - {this.props.state} - {this.props.country}
                        <span className="label label-info">Precio: ${this.props.price}</span>
                    </p>
                </div>
                <hr/>
            </div>
        )
    }
}

class Individual extends React.Component{
    render() {
        let clase = "item";
        if(this.props.index === 0){
            clase = "item active";
        }
        return(
            <div className={clase}>
                <div className="row">
                    <div className="col-md-12">
                        <a className="thumbnail" href="#">
                            <ItemImage picture={this.props.image} classStyle={""} ancho={250} alto={250}/>
                            <div className="carousel-caption">
                                <h3>{this.props.title}</h3>
                                <p>Precio:{this.props.price}</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

export default ItemsApp
