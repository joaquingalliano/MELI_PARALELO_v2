import './ItemDisplay.css';
import React, {Component}   from 'react';
import ItemGrid             from '../ItemGrid/ItemGrid';
import ItemList             from '../ItemList/ItemList';
import ItemCarrousel        from '../ItemCarrousel/ItemCarrousel';
import LoadingSpinner       from '../LoadingSpinner/LoadingSpinner';

class ItemDisplay extends Component {
    constructor() {
        super();

        this.state = {
            listing: 'grid',
            categorias: []
        }

        this.handleListing = this.handleListing.bind(this);
    }

    componentWillMount() {
        //Busco items
        if (this.props.match.params.keywords) {
            console.log("SEARCH!");
        }
        else {
            if(localStorage.getItem("user") != null) {
                if(localStorage.getItem("categorias") != null) {
                    let urlItemsCategoriaApi = 'http://localhost:7070/items/q=' + localStorage.getItem("categorias");
                    fetch(urlItemsCategoriaApi)
                    .then((response) => {
                        return response.json();
                    })
                    .then((items) => {
                        this.setState({ items: items })
                    })
                }
            } else {
                let urlItemsApi = "http://localhost:7070/items";
                fetch(urlItemsApi)
                .then((response) => {
                    return response.json()
                })
                .then((items) => {
                    this.setState({ items: items })
                })
            }
        }

        //Busco las categorias
        let urlCategorias = "http://localhost:7070/categories";
        fetch(urlCategorias)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            this.setState({categorias: data});
        });
    }

    handleListing(e) {
        let target = e.target;
        let listing = target.getAttribute('listing');

        this.setState({ listing: listing });
    }

    render() {
        const buttonGroup = (
            <div className="col-xs-12 buttonGroup">
                <button className="btn btn-white glyphicon glyphicon-th"
                    onClick={this.handleListing} listing="grid"></button>
                <button className="btn btn-white glyphicon glyphicon-th-list"
                    onClick={this.handleListing} listing="list"></button>
                <button className="btn btn-white glyphicon glyphicon-stop"
                    onClick={this.handleListing} listing="carrousel"></button>
            </div>
        );

        if (!this.state.items || !this.state.categorias) {
            return (
                <div style={{"marginTop": 200}}>
                    <LoadingSpinner />
                </div>
            );
        }

        let listing;
        let categorias = this.state.categorias;

        switch(this.state.listing) {
            case 'grid':
                listing = ( <ItemGrid data={this.state.items}/> );
                break;
            case 'list':
                listing = ( <ItemList data={this.state.items}/> );
                break;
            case 'carrousel':
                listing = ( <ItemCarrousel data={this.state.items}/> );
                break;
            default:
                listing = ( <div><h1>Error!</h1></div> );
        }

        return (
            <div>
                {buttonGroup}
                <Filtros categorias={categorias}/>
                <div className="itemListing col-xs-offset-3 col-xs-7">
                    {listing}
                </div>
            </div>
        );
    }
}

class Filtros extends Component {
    render() {
        let categorias = this.props.categorias;
        let options = [];

        categorias.map((cat, i) => {
            let optionHtml = (
                <option key={i} value={cat.id}>{cat.name}</option>
            );
            options.push(optionHtml);
        });

        return (
            <div className="col-xs-3 filtros">
                <h2>Filtros</h2>
                <div className="form-group">
                    <h5>Categoria</h5>
                    <select id="categorias" name="categorias" className="form-control">
                        <option value="#">Seleccione una categoria..</option>
                        {options}
                    </select>
                </div>
                <div className="form-group">
                    <label for="precioDesde" className="control-label">Rango de precios</label>
                    <div className="container-fluid form-horizontal">
                        <div className="form-group">
                            <label for="precioDesde" className="col-xs-2">De: </label>
                            <div className="col-xs-4">
                                <input type="number"
                                    className="form-control precio"
                                    min="0"
                                    name="precioDesde"
                                    placeholder="$100"/>
                            </div>
                            <label for="precioHasta" className="col-xs-2">Hasta:</label>
                            <div className="col-xs-4">
                                <input type="number"
                                    className="form-control precio"
                                    min="0"
                                    name="precioHasta"
                                    placeholder="$200"/>
                            </div>
                        </div>
                    </div>
                    <button className="btn btnFiltrar">Filtrar</button>
                </div>
            </div>
        );
    }
}

export default ItemDisplay;
