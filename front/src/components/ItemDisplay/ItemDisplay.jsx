import './ItemDisplay.css';
import React, {Component}   from 'react';
import ItemGrid             from '../ItemGrid/ItemGrid';
import ItemList             from '../ItemList/ItemList';
import ItemCarrousel        from '../ItemCarrousel/ItemCarrousel';
import LoadingSpinner       from '../LoadingSpinner/LoadingSpinner';
import NotFound             from '../NotFound/NotFound';
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
        let urlCategorias = "http://localhost:8080/categories";

        //Busco items
        if (this.props.location.search) {
            let params = queryString.parse(this.props.location.search);
            let urlSearch = "http://localhost:8080/items/search?";
            if (params.title) {
                let title = params.title;
                urlSearch += "title=" + title;
            }
            fetch(urlSearch)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.setState({
                    itemsTotales: data,
                    items: data
                });
            });
        }
        else {
            let user = localStorage.getItem("user");
            if(user) {
                user = JSON.parse(user);
                let categorias = user.preferences;
                let idCategorias = categorias.map((cat) => {return cat.id});

                fetch(urlItemsApi)
                .then((response) => {
                    return response.json();
                })
                .then((items) => {
                    let itemsUser = [];
                    let contador = 0;
                    items.forEach((item) => {
                        if (contador === 6) return;
                        if (idCategorias.indexOf(item.category.id) !== -1) {
                            itemsUser.push(item);
                            contador++;
                        }
                    });
                    this.setState({
                        itemsTotales: itemsUser,
                        items: itemsUser
                    })
                });
            } else {
                fetch(urlItemsApi)
                .then((response) => {
                    return response.json()
                })
                .then((items) => {
                    let contador = 0;
                    let nuevosItems = [];
                    items.forEach((item) => {
                        if (contador === 18) return;
                        nuevosItems.push(item);
                        contador++;
                    });
                    this.setState({
                        itemsTotales: nuevosItems,
                        items: nuevosItems
                    })
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
        let itemsNuevos = [];
        let itemsActuales = this.state.itemsTotales;
        console.log("filtrar!");
        if (catSeleccionada !== '0') {
            itemsActuales.forEach((item) => {
                if (item.category.id === catSeleccionada) {
                    itemsNuevos.push(item);
                }
            });
            this.setState({
                items: itemsNuevos
            });
        }
        else {
            this.setState({
                items: itemsActuales
            });
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

        if (this.state.items.message) {
            return (
                <NotFound />
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

        categorias.forEach((cat, i) => {
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
                            <option value="0">Todas</option>
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
