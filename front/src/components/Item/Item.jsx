import React, { Component } from 'react';
import NotFound from '../NotFound/NotFound';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './Item.css';

class Item extends Component {

    constructor() {
        super();

        this.state = {
            cargando: true,
            total: 0
        }

        this.calcularTotal = this.calcularTotal.bind(this);
    }

    componentWillMount() {
        this.cargarItem();
    }

    cargarItem() {
        let idItem  = this.props.match.params.itemID;
        let urlItemApi = "https://api.mercadolibre.com/items/" + idItem;
        //let urlItemApi = "http://localhost:7070/items/" + idItem;
        let urlDescriptionApi = urlItemApi + "/description";
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

            let pictures = [];
            if (data.pictures) {
                data.pictures.forEach((picture) => {
                    pictures.push(picture.url);
                });
            }
            let obj = {
                "title": data.title,
                "price": data.price,
                "pictures": pictures,
                "dateCreated": data.date_created
            }
            this.setState({
                item: obj,
                cargando: false
            });
            this.cargarItemsRelacionados();
        });

        //Descripcion
        fetch(urlDescriptionApi)
        .then((response) => {
            if (response.status !== 404) {
                return response.json();
            }
            return null;
        })
        .then((data) => {
            if (data) {
                this.setState({ itemDescription : data.plain_text });
            }
        });
    }

    cargarItemsRelacionados() {
        let urlItemsRelacionados = "https://api.mercadolibre.com/sites/MLA/search?category=" + this.state.item.categoriaItem;
        fetch(urlItemsRelacionados)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            var finalData = [];

            data.results.forEach(function(element) {
                var obj = {
                    "title":element.title,
                    "price":element.price,
                    "image":element.thumbnail
                }
                if (element.thumbnail){
                    finalData.push(obj);
                }
            });
            this.setState({ itemsRelacionados : finalData });
        });
    }

    calcularTotal(e) {
        let target   = e.target;
        let value    = target.value < 1 ? 1 : parseInt(target.value);
        let total    = this.state.item.price * value;

        this.setState({total: total})
    }

    agregarACarrito(e) {

        console.log(e);
    }

    render() {
        let item;
        let description;
        let error = this.state.error;
        let total;

        if (!this.state.cargando) {
            if (this.state.item) {
                item          = this.state.item;
                description   = this.state.itemDescription;
                total         = this.state.total === 0 ? item.price : this.state.total;
            }
            else {
                error = 404;
            }
        }

        if (this.state.cargando) {
            return (
                <div style={{"marginTop": 200}}>
                    <LoadingSpinner />
                </div>
            );
        }

        if (error) {
            return ( <NotFound /> );
        }

        return (
            <div>
                <div className="col-xs-8 col-sm-8 col-sm-offset-2 itemContainer">
                    <div className="itemHeader">
                        <Carrousel imagenes={item ? this.state.item.pictures : ""}/>
                        <div className="itemData">
                            <h3 className="itemTitle">{item ? item.title : ""}</h3>
                            <div className="itemSubData">
                                <h3>Price: ${item ? item.price : ""}</h3>
                                <h3>Shipping: $25</h3>
                                <h3>Quantity:
                                    <input type="number"
                                        min="1"
                                        className="quantitySelector"
                                        onChange={this.calcularTotal}/>
                                </h3>
                                <h2>Total: ${total}</h2>
                                <div className="itemButtons">
                                    <button className="btnCart"
                                        onClick={this.agregarACarrito}>Agregar a Carrito</button>
                                </div>
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
                <div className="col-xs-12 itemRelacionados">
                    <h1>Productos relacionados: </h1>
                    <div className="items">
                        <div className="itemRelacionado"></div>
                        <div className="itemRelacionado"></div>
                        <div className="itemRelacionado"></div>
                    </div>
                </div>
            </div>
        );
    }
}

class Carrousel extends Component {
    render() {
        let imagenes = this.props.imagenes;
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
                            <img src={imagenes[0]} alt="imagen1" style={img}/>
                        </div>

                        <div className="item" style={imgDiv}>
                            <img src={imagenes[1]} alt="imagen2" style={img} />
                        </div>

                        <div className="item" style={imgDiv}>
                            <img src={imagenes[2]} alt="imagen3" style={img} />
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
