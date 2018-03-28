import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import NotFound from '../NotFound/NotFound';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import {ItemCell} from '../ItemGrid/ItemGrid';
import './Item.css';

class Item extends Component {

    constructor() {
        super();

        this.state = {
            cargando: true,
            total: 0,
            hiddenAlert: true
        }

        this.calcularTotal = this.calcularTotal.bind(this);
        this.agregarACarrito = this.agregarACarrito.bind(this);
        this.showAlert = this.showAlert.bind(this);
    }

    componentWillMount() {
        this.cargarItem();
    }

    cargarItem() {
        let user = JSON.parse(localStorage.getItem("user"));
        let idItem  = this.props.match.params.itemID;
        let urlItemApi = "http://localhost:8080/items/" + idItem + "?user_id=" + user.id;
        //Item
        fetch(urlItemApi)
        .then((response) => {
            if (response.status !== 404) {
                return response.json();
            }
            else {
                this.setState({
                    error: 404,
                    cargando: false
                });
            }
        })
        .then((data) => {
            if (!data) {
                return;
            }
            this.setState({
                item: data
            });
            this.cargarItemsRelacionados();
        });
    }

    cargarItemsRelacionados() {
        let urlItemsRelacionados = "http://localhost:8080/categories/" + this.state.item.category.id + "/items";
        fetch(urlItemsRelacionados)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            this.setState({
                relacionados : data,
                cargando: false
            });
        });
    }

    calcularTotal(e) {
        let target   = e.target;
        let value    = target.value < 1 ? 1 : parseInt(target.value, 10);
        let total    = this.state.item.price * value;

        this.setState({total: total})
    }

    agregarACarrito() {

        fetch('http://localhost:8080/carrito?idUsuario=' + JSON.parse(localStorage.getItem("user")).id + '&idItem=' + this.props.match.params.itemID, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        alert("Item agregado a carrito");
        
        this.showAlert();

    }

    showAlert() {
        let newvalue = !this.state.hiddenAlert;
        console.log(newvalue);
        this.setState({
            hiddenAlert: newvalue
        });
    }

    render() {
        let item;
        let description;
        let error = this.state.error;
        let total;
        let relacionados;

        if (!this.state.cargando) {
            if (this.state.item) {
                item          = this.state.item;
                description   = item.description;
                total         = this.state.total === 0 ? item.price : this.state.total;
                relacionados  = [];
                for (var i = 0; i < 3; i++) {
                    let randIndex = Math.floor(Math.random() * this.state.relacionados.length);
                    relacionados.push(this.state.relacionados[randIndex]);
                }
            }
            else {
                error = 404;
            }
        }
        else {
            return (
                <div style={{"marginTop": 200}}>
                    <LoadingSpinner />
                </div>
            );
        }

        if (error) {
            return ( <NotFound /> );
        }
        let componente = this;
        let alertStyle = {
            "display": this.state.hiddenAlert ? "none" : "block"
        }

        return (
            <div>
                <div style={alertStyle}>
                    <h1>Item agregado!</h1>
                </div>
                <div className="col-xs-12 col-sm-8 col-sm-offset-2 itemContainer">
                    <div className="itemHeader">
                        <Carrousel imagenes={item ? this.state.item.pictures : ""} />
                        <div className="itemData">
                            <h3 className="itemTitle">{item ? item.title : ""}</h3>
                            <div className="itemSubData">
                                <h3>Price: ${item ? item.price : ""}</h3>
                                <h3>Shipping: $25</h3>
                                <h3>Quantity:
                                    <input type="number"
                                            min="1"
                                            max={this.state.item.available_quantity}
                                            className="quantitySelector"
                                            defaultValue="1"
                                            onChange={this.calcularTotal}/>
                                </h3>
                                <h2>Total: ${total}</h2>
                                <div className="itemButtons">
                                    <button className="btnCart" id="btnCart"
                                        onClick={function(e){componente.agregarACarrito()}}>Agregar a Carrito</button>
                                </div>
                                <script>
                                    
                                </script>
                            </div>
                        </div>
                    </div>
                    <div className="itemBody">
                        <h1>Caracteristicas</h1>
                        <div className="container-fluid">
                            <div className="col-xs-12" stlye={{"word-wrap": "break-word"}}>
                                <p>
                                    {description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12 col-sm-8 col-sm-offset-2 itemRelacionados">
                    <h1>Productos relacionados: </h1>
                    <div className="items">
                        {
                            relacionados.map((item, index) =>
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
                </div>
            </div>
        );
    }
}

class Carrousel extends Component {

    render() {
        let imagenes = this.props.imagenes;
        let id = this.props.id;
        let style = {
            "height": 350
        }
        let imgDiv = {
            "height": "100%"
        }
        let img = {
            "objectFit": "contain",
            "height": "100%"
        }
        return (
            <div className="itemCarrousel">
                <div id="myCarousel" className="carousel slide" data-ride="carousel" style={style}>
                    <div className="carousel-inner" style={imgDiv}>
                        <div className="item active" style={imgDiv}>
                            <img src={imagenes[0].url} alt="imagen1" style={img}/>
                        </div>
                        <div className="item" style={imgDiv}>
                            <img src={imagenes[1].url} alt="imagen2" style={img} />
                        </div>
                        <div className="item" style={imgDiv}>
                            <img src={imagenes[2].url} alt="imagen3" style={img} />
                        </div>
                    </div>

                    <a className="left carousel-control" href="#myCarousel" data-slide="prev">
                        <span className="glyphicon glyphicon-chevron-left"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="right carousel-control" href="#myCarousel" data-slide="next">
                        <span className="glyphicon glyphicon-chevron-right"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>
            </div>
        );
    }
}

export default Item;
