import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import './ShoppingCart.css';


class ShoppingCart extends Component {
    constructor() {
        super();

        this.state = {
            id_usuario: "",
            cupones_disp: 0,
            total_a_pagar: "",
            descuento: 0,
            cupones_ganados: 0,
            items_a_comprar: 0,
            items: [],
            data: []
        }
        this.handleTotal = this.handleTotal.bind(this);
    }

    handleTotal(e) { //e = [tipo, total, cupones_a_ganar, cant_item, idItem] x ej: (desc,1999,1,1,MLA123), (sum,3997,0,2,MLA434)
        var total = 0;
        var ant_total = this.state.total_a_pagar;
        var tipo = e[0];
        var cant = e[1];
        var cupones_a_ganar = e[2];
        var para_descuento = 10000;
        var porcentaje_descuento = 10/100;
        var items = e[3];
        var itemId = e[4];
        var items_ant = this.state.items_a_comprar;
        var itemsList = this.state.items;
        itemsList.forEach(element => {
            if (element.item.id == itemId){
                if (tipo == "desc"){
                    element.quantity -= items
                } else {
                    element.quantity += items
                }
            };
        });

        if (tipo == "desc"){
            total = ant_total - cant;
            items = items_ant - items;
        } else {
            total = ant_total + cant;
            items = items_ant + items;
        }
        if (total>para_descuento){
            var descuento = Math.floor(total*porcentaje_descuento);
            this.setState({
                total_a_pagar: total,
                descuento: descuento,
                items_a_comprar: items
            });
        }
        else {
            this.setState({
                total_a_pagar: total,
                descuento: 0,
                items_a_comprar: items
            });
        }
        this.setState({
            cupones_ganados: cupones_a_ganar,
            items: itemsList
        });
    };

    componentDidMount() {
        var id = JSON.parse(localStorage.getItem("user")).id;
        //console.log(id);
        //id = 1111;
        fetch('http://localhost:8080/carrito?idUsuario=' + id, { //traigo los datos
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:8080',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
                'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
                'Access-Control-Allow-Credentials': true,
                'common': "",
                'post': "",
                'put': "",
                'patch': ""

            }

        }).then((results) => {
            return results.json();
        }).then(info => {
            var jsons = [];
            var total_a_pagar = 0;
            var data = info[0].carrito;
            var items = [];
            data.forEach(element => {
                var nombre = element.nombre;
                var precio = element.precio;
                var cantidad = element.cantidad;
                var idItem = element.idItem;
                var itemJsonId = {
                    id: idItem
                };
                var itemJson = {
                    item: itemJsonId,
                    quantity: cantidad
                };
                items.push(itemJson);
                total_a_pagar += cantidad*precio;
                var json = {
                    nombre: nombre,
                    precio: precio,
                    idItem: idItem,
                    cantidad: cantidad
                }
                jsons.push(json);
            });
            var cupones_disp = info[0].cupones;
            var cupones_a_ganar = Math.floor(total_a_pagar/3000)
            var descuento = 0;
            if (total_a_pagar > 10000){
                descuento = total_a_pagar*10/100;
            }
            var items_a_comprar = data.length;
            this.setState({
                data: jsons,
                id_usuario: id,
                total_a_pagar: total_a_pagar,
                items_a_comprar: items_a_comprar,
                descuento: descuento,
                cupones_disp: cupones_disp,
                cupones_ganados: cupones_a_ganar,
                items: items
            })
        })
        /*this.setState({
            data: [{
                    nombre: "zapatillas",
                    precio: 2000,
                    idItem: "MLA12312",
                    cantidad: 3
                },
                {
                    nombre: "muebles",
                    precio: 10000,
                    idItem: "MLA123",
                    cantidad: 2
                }
            ],
            id_usuario: 1111,
            total_a_pagar: 26000,
            items_a_comprar: 5,
            descuento: 2600,
            cupones_disp: 39,
            cupones_ganados: 8,
            items: [{
                item: {
                    id: "MLA12312"
                },
                quantity: 3
                },
                {
                item: {
                    id: "MLA123"
                },
                    quantity: 2
                }
            ]
        })*/
    }

    render() {
        var cupones_ganados = parseInt(this.state.cupones_ganados)+parseInt(this.state.cupones_disp);
        var total_con_desc = this.state.total_a_pagar - this.state.descuento;
        var items_a_comprar = this.state.items_a_comprar;
        var id = this.state.id_usuario;
        var total_a_pagar = this.state.total_a_pagar;
        var itemsList = this.state.items;
        let descuento = this.state.descuento;

        if(this.state.data == "") {
            return "";
        } else {
            return (
                <Router>
                    <div className="col-xs-12 col-sm-offset-2 col-sm-8">
                        <h2>Carrito de compras</h2>
                        <TablaItems data={this.state.data} tot={this.handleTotal}
                            descuento={descuento}
                            totalDescuento={total_con_desc}/>

                        <Route path="/success" render={() =>
                            <Success cupones={cupones_ganados} items={items_a_comprar} id={id} total={total_con_desc} itemsList={itemsList} />
                        }/>
                    </div>
                </Router>
            );
        }
    }
}

class Success extends Component{
    constructor() {
        super();

        this.state = {
            result: "",
            error: "",
            items: "",
            cupones: ""
        }
    }

    componentDidMount() {
        var cupones = this.props.cupones;
        var items = this.props.items;
        var total = this.props.total;
        var id = this.props.id;
        var itemsList = this.props.itemsList;
        var error = "";

        this.setState({
            items: items,
            cupones: cupones
        }); 

        var json = {
            final_price: total,
            base_price: total,
            user_id: id,
            coupons: cupones,
            details: itemsList,
            discount: 1
        }
        
        fetch('http://localhost:8080/purchases', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                json
            })
        }).then((results) => {
            return results.json();
        }).then((result) => {
            if (result.message != undefined) {
                error = result.message;
                this.setState({
                    error: error
                }); 
            } else {
                this.setState({
                    result: result
                }); 
            }
        });
    }
    
    render() {
        if(this.state.result == "" && this.state.error == "") { 
            return "";
        } else {
            var error = this.state.error;
            var result = this.state.result;
            var items = this.state.items;
            var cupones = this.state.cupones;
            
            window.location.href = 'http://localhost:8081/';

            if (error != "") {
                return(
                    <div>
                        <script>
                            function myFunction() {
                                alert("Hubo un error en la compra:\n" + error)
                            }
                        </script> 
                        
                    </div>
                );
            } else {
                var userJson = {id: this.props.id}
                fetch('http://localhost:8080/carrito?idUsuario=' + userJson.id, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userJson
                    })
                })
                return(
                    <div>
                        <script>
                            function myFunction() {
                                alert("Compra realizada con exito! \n Cupones finales:" + cupones + "\n Items comprados:" + items)
                            }
                        </script> 
                        
                    </div>
                )
            }
        }
    }
}

class TablaItems extends Component {
    constructor() {
        super();
        this.state = {
            total: "",
            cupones: ""
        }
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount(){
        const pesos_cupones=3000;
        var total = 0;
        var cupones = this.state.cupones;
        var items = 0;
        this.props.data.forEach(elem => {
            total += elem.precio*elem.cantidad;
            items += 1;
        });
        cupones += Math.floor(total/pesos_cupones);
        this.setState({
            total: total,
            cupones: cupones,
        });
    }

    handleClick(e) { // e = [total nuevo del producto , total viejo del producto, "limpiar", itemID]
        const pesos_cupones=3000;
        var subtotal = this.state.total - e[1];
        var total = subtotal + e[0];
        var cupones = 0; //[0,100,1]
        var sub_ant = e[1];
        var sub_nuevo = e[0];
        var cant_items = e[2];
        var idIt = e[3];

        cupones += Math.floor(total/pesos_cupones);

        this.setState({
            total: total,
            cupones: cupones
        });

        if (sub_nuevo>sub_ant){ //aumentar
            this.props.tot(["sum",sub_nuevo-sub_ant,cupones,cant_items, idIt]);
        } else {
            this.props.tot(["desc",sub_ant-sub_nuevo,cupones,cant_items, idIt]);
        }

    };

    render() {
        let data = this.props.data;
        let rowHeight = 100 / data.length;
        let totalConDescuento = this.props.totalDescuento;
        let descuento = this.props.descuento;

        return(
            <div className="divCartItemTable">
                <table className="table cartItemTable">
                    <tbody>
                        <tr>
                            <th scope="col">Nombre del producto</th>
                            <th scope="col">Precio unitario</th>
                            <th scope="col">Cantidad</th>
                            <th scope="col" style={{"textAlign": "right"}}>Subtotal</th>
                       </tr>
                        {data.map((elem, x) =>

                            <Item key={x} elem={elem} rowHeight={rowHeight} total={this.handleClick} id={elem.idItem}/>
                        )}
                        <tr>
                            <td>Cupones a ganar:</td>
                            <td>{this.state.cupones}</td>
                            <td>SubTotal:</td>
                            <td style={{"textAlign": "right"}}>
                                ${this.state.total}
                            </td>
                       </tr>
                       <tr>
                           <td>Descuento:</td>
                           <td>${descuento}</td>
                           <td style={{"fontWeight": "bold"}}>Total a pagar:</td>
                           <td style={{"textAlign": "right", "fontWeight": "bold"}}>${totalConDescuento}</td>
                       </tr>
                    </tbody>
                </table>
                <Link className="btnComprar" to="/success">Comprar</Link>
            </div>
        );
    }
}

class Item extends Component {
    constructor() {
        super();
        this.state = {
            itemId: "",
            cantidad: ""
        }
        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(e) {
        const target = e.target;
        const name = target.name;
        var cant_vieja = this.state.cantidad
        var itId = this.state.itemId;

        if (target.value <= 0 || target.value == ""){ //cuando agregamos una cantidad negativa o borramos el numero del input
            var anterior = this.props.elem.precio * this.state.cantidad;
            this.setState({
                [name]: 0
            });
            this.props.total([0,anterior,cant_vieja,itId]);
            return(
                "" //devolvemos vacio
            );
        }

        const value = parseInt(target.value);

        var total = this.props.elem.precio * value;

        var anterior = this.props.elem.precio * this.state.cantidad;
        this.setState({
            [name]: value
        });
        if (cant_vieja < value){
            this.props.total([total,anterior, value-cant_vieja, itId]); //actualizamos el total
        } else {
            this.props.total([total,anterior, cant_vieja-value, itId]); //actualizamos el total
        }

    };

    componentWillMount(){
        this.setState({
            cantidad: this.props.elem.cantidad,
            itemId: this.props.id
        });
    }

    render() {
        let elem = this.props.elem;
        let width = 100
        let height = this.props.rowHeight;

        return(
            <tr>
                <td className="trend">
                    {elem.nombre}
                </td>
                <td className="trend">
                    {elem.precio}
                </td>
                <td className="trend">
                    <input type="number"
                        id="cantidad"
                        name="cantidad"
                        defaultValue={elem.cantidad}
                        min="1"
                        onChange={this.handleInput}
                        className="form-control"/>
                </td>
                <td className="trend" style={{"textAlign": "right"}}>
                    ${this.state.cantidad * elem.precio}
                </td>
            </tr>
        );
    }
}

export default ShoppingCart;
