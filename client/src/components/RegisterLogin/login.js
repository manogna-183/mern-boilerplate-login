import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/user_actions';
import { Link } from 'react-router-dom';

// Import Materialize
import M from "materialize-css";


class Login extends Component {
    
    state = {
        email:"",
        password:"",
        errors:[]
    }

    displayErrors = (errors) => {
        return errors.map((error, i) => <p key={i}>{error}</p>);
    }
    
    componentDidMount() {
        // Auto initialize all the Materialize things!
        M.AutoInit();
    }
    
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    submitForm = (event) => {
        event.preventDefault();

        let dataToSubmit = {
            email: this.state.email,
            password: this.state.password
        }

        if(this.isFormValid(this.state)){
            this.setState({errors: []});
            
            this.props.dispatch(loginUser(dataToSubmit))
                .then(response => {
                    if(response.payload.loginSuccess) {
                        this.props.history.push('/');
                    } else {
                        this.setState({
                            errors: this.state.errors.concat("Failed to log in, check your credentials")
                        });
                    }
                });
        } else {
            this.setState({
                errors: this.state.errors.concat("Not a valid Form")
            });
        }
    }

    isFormValid = ({email, password}) => email && password;

    render() {
        return (
            <div className="container">
                <h2>Log In</h2>
                <div className="row">
                    <form className="col s12" onSubmit={this.submitForm}>
                        <div className="row">
                            <div className="input-field col s12">
                                <input 
                                    name="email"
                                    value={this.state.email}
                                    onChange={this.handleChange}
                                    id="email"
                                    type="email"
                                    className="validate"
                                />
                                <label htmlFor="email">Email</label>
                                <span 
                                    className="helper-text"
                                    data-error="Please enter a valid email"
                                    date-success="right" 
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <input 
                                    name="password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                    id="password"
                                    type="password"
                                    className="validate"
                                />
                                <label htmlFor="password">Password</label>
                                <span 
                                    className="helper-text"
                                    data-error="wrong"
                                    date-success="right" 
                                />
                            </div>
                        </div>

                        {this.state.errors.length > 0 && (
                            <div>
                              {this.displayErrors(this.state.errors)} 
                            </div>
                        )}

                        <div className="row">
                            <div className="col s2">
                                <button className="btn waves-effect red lighten-2"
                                        type="submit"
                                        name="action"
                                        onClick={this.submitForm}
                                        >Login</button>
                            </div>
                            <div className="col s2">
                                <Link to="/register"
                                      className="btn waves-effect red lighten-2"
                                      name="action"
                                >Sign up</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        user: state.user
    };
}

export default connect(mapStateToProps)(Login);