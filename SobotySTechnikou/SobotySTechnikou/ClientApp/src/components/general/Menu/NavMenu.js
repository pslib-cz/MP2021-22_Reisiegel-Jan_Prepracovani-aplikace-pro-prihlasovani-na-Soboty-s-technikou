import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoginMenu } from '../../api-authorization/LoginMenu';
import './NavMenu.css';
import { useAuthContext } from '../../../providers/AuthProvider';
import { Col, Dropdown, Nav, Navbar, Row } from 'rsuite';
import { Spinner } from 'reactstrap';

export const NavMenu = props => {
    const [{ profile, accessToken, isUserLoading, userManager }] = useAuthContext();
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    console.log(accessToken);
    return (
        <Navbar>
            <Row>
                <Col lg={2}>
                </Col>
                <Col lg={20}>
                    <Navbar.Brand as={Link} to={"/"} style={{ fontWeight: "bold" }}>
                        Soboty S technikou
                    </Navbar.Brand>
                    <Nav>
                        <Nav.Item as={Link} to={"/"}>
                            Domu
                        </Nav.Item>
                        <Nav.Item as={Link} to={"/Users"}>
                            Uživatelé
                        </Nav.Item>
                        <Nav.Item as={Link} to={"/AllActions"}>
                            Akce
                        </Nav.Item>
                        <Nav.Item as={Link} to={"/AllGroups"}>
                            Skupiny
                        </Nav.Item>
                        <Nav.Item as={Link} to={"/EditUser"}>
                            Upravit účet
                        </Nav.Item>
                    </Nav>
                    <Nav pullRight>
                        {
                            accessToken ?
                                <Nav.Item as={Link} to="/Profile">{profile.name}</Nav.Item>
                                : isUserLoading ?
                                    <Spinner size={"sm"} />
                                    : null
                        }
                        {
                            userManager ?
                                accessToken ?
                                    <Nav.Item as={Link} to="/home" onClick={() => { userManager.signoutRedirect() }}>Odhlásit</Nav.Item> :
                                    <Nav.Item as={Link} to="/home" onClick={() => { userManager.signinRedirect({ redirectUrl: "/" }) }}>Přihlásit se</Nav.Item> :
                                null

                        }

                    </Nav>
                </Col>
                <Col lg={2}>
                </Col>
            </Row>

        </Navbar >
    )
}