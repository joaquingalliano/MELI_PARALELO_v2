import { Chart } from 'react-google-charts';
import React from 'react';

class AdminView extends React.Component {

    constructor(props) {
        super(props);
        this.state = { items: [], usuarios: [] };
    }

    componentWillMount() {
        //localStorage.setItem("user","JUAN PEREZ");
        //localStorage.removeItem("user");
        //localStorage.setItem("userType", "admin");
        let user = JSON.parse(localStorage.getItem("user"))
        //console.log(localStorage.getItem("user"));
        //console.log(JSON.parse(localStorage.getItem("user")).username);
        //if(user != null){
            //if(user.username === "admin@admin.com"){
                fetch('http://localhost:7070/items')
                    .then((response) => {
                        return response.json()
                    })
                    .then((items) => {
                        //console.log(items);
                        this.setState({ items: items })
                    })

                fetch('http://localhost:7070/stats')
                    .then((response) => {
                        return response.json()
                    })
                    .then((usuarios) => {
                        //console.log(items);
                        this.setState({ usuarios: usuarios })
                    })
            //}
        //}
    }

    render() {

        this.state.items.sort((a, b) => parseInt(b.query_count) - parseInt(a.query_count) );
        this.state.usuarios.sort((a,b) => parseInt(b.bought_items) - parseInt(a.bought_items) );
        //console.log(this.state.usuarios);
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
                    <div id="items" className="table-responsive">
                        <h2> Resumen de Visitas y Compras por Item</h2>
                        <table className="table table-hover">
                            <thead><tr><td>Item</td><td>Visitas</td><td>Compras</td><td>% de compra</td></tr></thead>
                            <ItemsList items={arrayItems} />
                        </table>
                    </div>


                    <ChartView data={dataItems} chartID={"itemsChart"}/>


                    <div id="usuarios" className="table-responsive">
                        <h2> Resumen de Visitas y Compras por Usuario</h2>
                        <table className="table table-hover">
                            <thead><tr><td>Item</td><td>Visitas</td><td>Compras</td><td>% de compra</td></tr></thead>
                            <UsuariosList usuarios={arrayUsers}/>
                        </table>
                    </div>
                    <ChartView data={dataUsers} chartID={"usersChart"}/>
                </div>
            )
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
            data:[
              ["Item1",1,5],
                ["Item2",4,2],
                ["Item3",6,53],
                ["Item4",2,15],
            ],
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
