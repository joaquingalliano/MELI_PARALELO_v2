import React from 'react';
//import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { userActions } from '../_actions';
import strings from '../lang/languajes';

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                name: '',
                surname: '',
                email: '',
                password: '',
                preferences: [],
                lenguage: 'english'
            },
            categories: [],
            submitted: false
        };

        fetch('http://localhost:8080/categories')
        .then(res => { return res.json()
        })
        .then((category) => {
            this.setState({categories:category})
        });

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onCheckClick = this.onCheckClick.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        const { user } = this.state;

        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }

    onCheckClick(selected) {
        const index = this.state.user.preferences.indexOf(selected);
        if (index < 0) {
          this.state.user.preferences.push(selected);
        } else {
          this.state.user.preferences.splice(index, 1);
        }
        this.setState({ preferences: [...this.state.user.preferences] });
        console.log(this.state.user.preferences);
      }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({ submitted: true });
        const { user } = this.state;
        const { dispatch } = this.props;

        if (user.name && user.surname && user.email && user.password && user.preferences ) {
            dispatch(userActions.register(user));
            localStorage.setItem("categorias", user.preferences);
        }
    }

    render() {
        var categ = this.state.categories;
        const lang = strings[this.state.user.lenguage];
        const estilo ={overflowX: 'scroll', height: '200px', columnCount: '2'}
        const labelS={height: '34px'}
        const { registering  } = this.props;
        const { user, submitted } = this.state;
        return (
            <div className="col-md-6 col-md-offset-3">

                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (submitted && !user.name ? ' has-error' : '')}>
                        <label htmlFor="name">{lang.registro.nombre}</label>
                        <input type="text" className="form-control" name="name" value={user.name} onChange={this.handleChange} />
                        {submitted && !user.name &&
                            <div className="help-block">{lang.registro.mensajeNombre}</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !user.surname ? ' has-error' : '')}>
                        <label htmlFor="surname">{lang.registro.apellido}</label>
                        <input type="text" className="form-control" name="surname" value={user.surname} onChange={this.handleChange} />
                        {submitted && !user.surname &&
                            <div className="help-block">{lang.registro.mensajeApellido}</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !user.email ? ' has-error' : '')}>
                        <label htmlFor="email">{lang.registro.email}</label>
                        <input type="email" className="form-control" name="email" value={user.email} onChange={this.handleChange} />
                        {submitted && !user.email &&
                            <div className="help-block">Email es requerido</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !user.password ? ' has-error' : '')}>
                        <label htmlFor="password">{lang.registro.contraseña}</label>
                        <input type="password" className="form-control" name="password" value={user.password} onChange={this.handleChange} />
                        {submitted && !user.password &&
                            <div className="help-block">Contraseña requerida</div>
                        }
                    </div>
                    <label>{lang.registro.categoriaPreferida}</label>
                    <div style={estilo} className={'form-group' + (submitted && !user.preferences ? ' has-error' : '')}>
                    {categ.map((categoria, i) =>
                    <div key = {i}>
                        <label style={labelS} className="checkbox-inline" htmlFor="preferences">
                        <input type="checkbox" key={i} className="form-control"
                        onClick={() => this.onCheckClick(categoria.id)}
                        name={categoria.name} value={categoria.id}/>
                        {categoria.name}
                        </label>
                    </div>
                    )}
                    {submitted && !user.preferences &&
                            <div className="help-block">Seleccione al menos un elemento</div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">{lang.registro.botonRegistrarse}</button>
                        {registering}
                        <a href="/login" className="btn btn-link">{lang.registro.botonCancelar}</a>
                    </div>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { registering } = state.registration;
    return {
        registering
    };
}

//export default RegisterPage

 export default connect(mapStateToProps)(RegisterPage);
// export { connectedRegisterPage as RegisterPage };
