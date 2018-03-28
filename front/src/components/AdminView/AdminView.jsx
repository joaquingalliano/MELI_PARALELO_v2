import { Chart } from 'react-google-charts';
import React from 'react';

class AdminView extends React.Component {

    constructor(props) {
        super(props);
        this.state = { items: [], usuarios: [], user:{} };
    }

    componentWillMount() {
        this.state.user = JSON.parse(localStorage.getItem("user"));
        if(this.state.user != null){
            if(this.state.user.username === "admin@admin.com"){
                fetch('http://localhost:8080/items')
                    .then((response) => {
                        return response.json()
                    })
                    .then((items) => {
                        this.setState({ items: items })
                    })

                fetch('http://localhost:8080/stats')
                    .then((response) => {
                        return response.json()
                    })
                    .then((usuarios) => {
                        this.setState({ usuarios: usuarios })
                    })
            }
        }
    }

    render() {
        if(this.state.user != null){
            if(this.state.user.email != "admin@admin.com"){
                return(
                    <div><h3>No tiene los permisos necesarios.</h3></div>
                )
            }
        }
        else{
            return(
                <div><h3>Debe iniciar sesion para acceder a esta sección.</h3></div>
            )
        }

        this.state.items.sort((a, b) => parseInt(b.query_count) - parseInt(a.query_count) );
        this.state.usuarios.sort((a,b) => parseInt(b.bought_items) - parseInt(a.bought_items) );
        let cantItems = 10 <= this.state.items.length ? 10 : this.state.items.length;
        let cantUsers = 10 <= this.state.usuarios.length ? 10 : this.state.usuarios.length;
        let arrayItems = [];
        let arrayUsers = [];
        let dataItems = [];
        let dataUsers = [];
        for(let i=0; i< cantItems; i++){
            arrayItems.push(this.state.items[i]);
            dataItems.push([this.state.items[i].title,parseInt(this.state.items[i].query_count),parseInt(this.state.items[i].bought_count)]);
        }
        for(let i=0; i< cantUsers; i++){
            arrayUsers.push(this.state.usuarios[i]);
            dataUsers.push([this.state.usuarios[i].user_id,parseInt(this.state.usuarios[i].visit_items),parseInt(this.state.usuarios[i].bought_items)]);
        }

        return (
                <div>
                    <Items arrayItems={arrayItems} dataItems={dataItems} />
                    <Users arrayUsers={arrayUsers} dataUsers={dataUsers} />
                </div>
            )
    }

}


class Items extends React.Component{
    render(){
        if(this.props.arrayItems.length > 0){
            return(
                <div id="items" className="table-responsive">
                    <h2> Resumen de Visitas y Compras por Item</h2>
                    <table className="table table-hover">
                        <thead><tr><td>Item</td><td>Visitas</td><td>Compras</td><td>% de compra</td></tr></thead>
                        <ItemsList items={this.props.arrayItems} />
                    </table>
                    <ChartView data={this.props.dataItems} chartID={"itemsChart"}/>
                </div>
            )
        }
        else
        {
            return(
                <div><h3>No existen datos sobre items para graficar.</h3></div>
            )
        }
    }
}

class Users extends React.Component{
    render(){
        console.log(this.props.arrayUsers);
        if(this.props.arrayUsers.length > 0){
            return(
                <div id="usuarios" className="table-responsive">
                    <h2> Resumen de Visitas y Compras por Usuario</h2>
                    <table className="table table-hover">
                        <thead><tr><td>Item</td><td>Visitas</td><td>Compras</td><td>% de compra</td></tr></thead>
                        <UsuariosList usuarios={this.props.arrayUsers}/>
                    </table>
                    <ChartView data={this.props.dataUsers} chartID={"usersChart"}/>
                </div>
            )
        }
        else{
            return(
                <div><h3>No existen datos sobre usuarios para graficar.</h3></div>
            )
        }
    }
}

class ItemsList extends React.Component{
    render(){
        return(
            <tbody>
            {
                this.props.items.map((item) => {
                    return <Detail nombre={item.title} visitas={item.query_count} compras={item.bought_count}/>
                })
            }
            </tbody>
        )
    }
}

class UsuariosList extends React.Component{
    render(){
        return(
            <tbody>
            {
                this.props.usuarios.map((user) => {
                    return <Detail nombre={user.user_id} visitas={user.visit_items} compras={user.bought_items}/>
                })
            }
            </tbody>
        )
    }
}


class Detail extends React.Component{
    render(){

        let porcentaje = ((this.props.compras * 100) / this.props.visitas).toFixed(2);
        return(
            <tr>
                <td>{this.props.nombre}</td>
                <td>{this.props.visitas}</td>
                <td>{this.props.compras}</td>
                <td>{porcentaje}</td>
            </tr>
        )
    }
}


class ChartView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: {
                vAxis: { title: 'Cantidad'},
            },
            columns: [
                {
                    type:'string',
                    label:'Item',
                },
                {
                    type: 'number',
                    label: 'Visitas',
                },
                {
                    type: 'number',
                    label: 'Compras',
                },

            ],
        };
    }
    render() {
        if(this.props.data.length > 0){
            return (
                <Chart
                    chartType="ColumnChart"
                    rows={this.props.data}
                    columns={this.state.columns}
                    options={this.state.options}
                    graph_id={this.props.chartID}
                    width="80%"
                    height="300px"
                    legend_toggle
                />
            );
        }
        else{
            return(
                <div>Procesando datos...</div>
            )
        }
    }
}


export default AdminView
