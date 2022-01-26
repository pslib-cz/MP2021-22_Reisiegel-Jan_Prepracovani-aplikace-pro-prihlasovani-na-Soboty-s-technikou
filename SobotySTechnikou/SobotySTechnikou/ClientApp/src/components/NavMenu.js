import React, { Component, useState } from 'react';
import { Collapse, Container, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LoginMenu } from './api-authorization/LoginMenu';
import './NavMenu.css';
import { useAuthContext } from '../providers/AuthProvider';

export const NavMenu = props => {
    const [{ profile, accessToken, isUserLoading }] = useAuthContext();
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    return (
        <header>
            <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
                <Container>
                    <NavbarBrand tag={Link} to="/">IdentityReactDemo</NavbarBrand>
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
                                    isUserLoading
                                        ?
                                        <Spinner size="sm" />
                                        :
                                        <NavLink tag={Link} to="/">{accessToken ? profile.name : "Sign In"}</NavLink>
                                }
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
        </header>
    )
}
