import React, { Component } from 'react';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/user_actions';
import { Link } from 'react-router-dom';

// Import Materialize
import M from "materialize-css";

class Register extends Component {

    state = {
        email:"",
        password:"",
        password2:"",
        firstname:"",
        lastname:"",
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

    isFormValid = () => this.state.email && this.state.password && this.state.password2 &&
                        this.state.firstname && this.state.lastname;

    passwordsMatch = () => this.state.password === this.state.password2;

    submitForm = (event) => {
        event.preventDefault();

        if(this.isFormValid() && this.passwordsMatch()){
            this.setState({errors: []});

            let dataToSubmit = {
                email: this.state.email,
                password: this.state.password,
                firstname: this.state.firstname,
                lastname: this.state.lastname,
                role: 0,
                token: "",
                tokenExp: 0
            }

            this.props.dispatch(registerUser(dataToSubmit))
                .then(response => {
                    if(response.payload.registerSuccess) {
                        this.props.history.push('/login');
                    } else {
                        this.setState({
                            errors: this.state.errors.concat("Failed to register, enter valid values")
                        });
                    }
                });
        }
        if(!this.passwordsMatch()) {
            this.setState({
                errors: this.state.errors.concat("Passwords don't match")
            });
        }
        if(!this.isFormValid()) {
            this.setState({
                errors: this.state.errors.concat("Not a valid Form")
            });  
        }
    }

    render() {
        return (
            <div className="container">
                <h3>Personal Information</h3>
                <div className="row">
                    <form className="col s12" onSubmit={this.submitForm}>
                        <div className="row">
                            <div className="input-field col s12">
                                <input 
                                    name="firstname"
                                    value={this.state.firstname}
                                    onChange={this.handleChange}
                                    id="firstname"
                                    type="text"
                                    className="validate"
                                />
                                <label htmlFor="firstname">First Name</label>
                                <span 
                                    className="helper-text"
                                    data-error="First name should not be more than 50 characters"
                                    date-success="right" 
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <input 
                                    name="lastname"
                                    value={this.state.lastname}
                                    onChange={this.handleChange}
                                    id="lastname"
                                    type="text"
                                    className="validate"
                                />
                                <label htmlFor="lastname">Last Name</label>
                                <span 
                                    className="helper-text"
                                    data-error="Last name should not be more than 50 characters"
                                    date-success="right" 
                                />
                            </div>
                        </div>
                        <br />
                        <h3>Account Information</h3>
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
                        <div className="row">
                            <div className="input-field col s12">
                                <input 
                                    name="password2"
                                    value={this.state.password2}
                                    onChange={this.handleChange}
                                    id="password2"
                                    type="password"
                                    className="validate"
                                />
                                <label htmlFor="password2">Confirm Password</label>
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
                                <Link to="#"
                                      className="btn waves-effect red lighten-2"
                                      name="action"
                                      onClick={this.submitForm}
                                >Create an account</Link>
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

export default connect(mapStateToProps)(Register);
