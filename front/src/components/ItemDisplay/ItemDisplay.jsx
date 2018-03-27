import './ItemDisplay.css';
import React, {Component}   from 'react';
import ItemGrid             from '../ItemGrid/ItemGrid';
import ItemList             from '../ItemList/ItemList';
import ItemCarrousel        from '../ItemCarrousel/ItemCarrousel';
import LoadingSpinner       from '../LoadingSpinner/LoadingSpinner';
import queryString          from 'query-string';

class ItemDisplay extends Component {
    constructor() {
        super();

        this.state = {
            listing: 'grid',
            categorias: [],
            precioDesde: 0,
            precioHasta: 200
        }

        this.handleListing = this.handleListing.bind(this);
        this.filtrar = this.filtrar.bind(this);
        this.changePrecio = this.changePrecio.bind(this);
    }

    componentWillMount() {
        let urlItemsApi = "http://localhost:8080/items";
        let urlItemsCategoriaApi = 'http://localhost:8080/items/q=' + localStorage.getItem("categorias");
        let urlCategorias = "http://localhost:8080/categories";

        //Busco items
        if (this.props.location.search) {
            let params = queryString.parse(this.props.location.search);
            let categoria = params.categories;
            let urlSearch = "http://localhost:8080/items/search?categories=" + categoria;
            fetch(urlSearch)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                this.setState({
                    items: data
                });
            })
            params.categories;
        }
        else {
            if(localStorage.getItem("user") != null) {
                if(localStorage.getItem("categorias") != null) {
                    fetch(urlItemsCategoriaApi)
                    .then((response) => {
                        return response.json();
                    })
                    .then((items) => {
                        this.setState({ items: items })
                    })
                }
            } else {
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

    changePrecio(e) {
        let target = e.target;
        let value = target.value;
        let name = target.name;

        this.setState({
            [name]: value
        });
    }

    filtrar(e) {
        let catSeleccionada = this.refs.categoriaSeleccionada.value;
        if (catSeleccionada != 0) {
            let urlSearchCategory = "/search?categories=" + catSeleccionada;
            window.location.href = urlSearchCategory;
        }
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

        let categorias = this.state.categorias;
        let options = [];

        categorias.map((cat, i) => {
            let optionHtml = (
                <option key={i} value={cat.id}>{cat.name}</option>
            );
            options.push(optionHtml);
        });

        return (
            <div>
                {buttonGroup}
                <div className="col-xs-3 filtros">
                    <h2>Filtros</h2>
                    <div className="form-group">
                        <h5>Categoria</h5>
                        <select ref="categoriaSeleccionada" id="categorias"
                            name="categorias"
                            className="form-control"
                            >
                            <option value="0">Seleccione una categoria..</option>
                            {options}
                        </select>
                    </div>
                    <button className="btn btnFiltrar"
                        onClick={this.filtrar}>Filtrar</button>
                </div>

                <div className="itemListing col-xs-offset-3 col-xs-7">
                    {listing}
                </div>
            </div>
        );
    }
}

export default ItemDisplay;
