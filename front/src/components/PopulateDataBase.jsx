import React from 'react';

class PopulateDataBase extends React.Component {

    constructor(props) {
        super(props);
        this.state = { categorias:[], items: []};
    }

    componentWillMount() {

        fetch('http://localhost:8080/categories')
            .then((response) => {
                return response.json()
            })
            .then((categorias) => {
                this.setState({ categorias: categorias });
                this.state.categorias.map((cat) => {
                    console.log('http://localhost:8080/categories/'+cat.id+'/items');
                    fetch('http://localhost:8080/categories/'+cat.id+'/items')
                        .then((response) => {
                            return response.json()
                        })
                        .then((items) => {
                            this.setState({ items: items })
                        })


                })
            })

    }

    render() {
        console.log(this.state.categorias);
        console.log(this.state.items);
        return(
            <div>

            </div>
        )
    }

}

export default PopulateDataBase