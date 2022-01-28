import React, { Component, useState } from 'react';
import { Collapse, Container, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LoginMenu } from './api-authorization/LoginMenu';
import './NavMenu.css';
import { useAuthContext } from '../providers/AuthProvider';

export const NavMenu = props => {
    const [{ profile, accessToken, isUserLoading, userManager }] = useAuthContext();
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    console.log(profile);
    return (
        <header>
            <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
                <Container>
                    <NavbarBrand tag={Link} to="/">Soboty s technikou</NavbarBrand>
                    <NavbarToggler onClick={toggle} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="me-auto" navbar>
                            <NavItem>
                                <NavLink tag={Link} to="/">Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} to="/public">Public</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} to="/protected">Protected</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} to="/unprotected">Unprotected</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} to="/admin">Admin</NavLink>
                            </NavItem>
                        </Nav>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                {
                                    userManager ?
                                        accessToken?
                                        <NavLink tag={Link} to="/home" onClick={() => {userManager.signoutRedirect()}}>{profile.name}</NavLink> :
                                        <NavLink tag={Link} to="/home" onClick={() => { userManager.signinRedirect({redirectUrl: "/"}) }}>Přihlásit se</NavLink>:
                                    null

                                }
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
        </header>
    )
}
