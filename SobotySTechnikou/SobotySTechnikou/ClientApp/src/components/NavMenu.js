import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoginMenu } from './api-authorization/LoginMenu';
import './NavMenu.css';
import { useAuthContext } from '../providers/AuthProvider';
import { Dropdown, Nav, Navbar } from 'rsuite';
import { Spinner } from 'reactstrap';

export const NavMenu = props => {
    const [{ profile, accessToken, isUserLoading, userManager }] = useAuthContext();
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    console.log(accessToken);
    return (
        <Navbar>
            <Nav>
                <Nav.Item as={Link} to={"/"}>
                    Domu
                </Nav.Item>
                <Nav.Item as={Link} to={"/Users"}>
                    Domu
                </Nav.Item>
                <Nav.Item as={Link} to={"/Public"}>
                    Domu
                </Nav.Item>
                <Nav.Item as={Link} to={"/admin"}>
                    Domu
                </Nav.Item>
                <Nav.Item as={Link} to={"/protected"}>
                    Domu
                </Nav.Item>
            </Nav>
            <Nav pullRight>
                {
                    accessToken ?
                        <Nav.Item tag={Link} to="/profile">{profile.name}</Nav.Item>
                        : isUserLoading ?
                            <Spinner size={"sm"} />
                            : null
                }

                {
                    userManager ?
                        accessToken ?
                            <Nav.Item tag={Link} to="/profile" onClick={() => { userManager.signoutRedirect() }}>Odhlásit</Nav.Item> :
                            <Nav.Item tag={Link} to="/home" onClick={() => { userManager.signinRedirect({ redirectUrl: "/" }) }}>Přihlásit se</Nav.Item> :
                        null

                }
                
            </Nav>
        </Navbar >
    )
}