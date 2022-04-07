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
    console.log(profile)
    return (
        <Navbar>
            <Row>
                <Col lg={2}>
                </Col>
                <Col lg={20}>
                    <Navbar.Brand as={Link} to={"/"} style={{ fontWeight: "bold" }}>
                        Soboty S technikou
                    </Navbar.Brand>
                    {
                        profile ? profile.admin ? (
                            <Nav>
                                <Nav.Dropdown title={"Uživatelé"}>
                                    <Nav.Dropdown.Item as={Link} to="/Users">
                                        Seznam
                                    </Nav.Dropdown.Item>
                                    <Nav.Dropdown.Item as={Link} to="/Profile">
                                        Detail
                                    </Nav.Dropdown.Item>
                                </Nav.Dropdown>
                                <Nav.Dropdown title={"Skupiny"}>
                                    <Nav.Dropdown.Item as={Link} to="/NewGroup">
                                        Nová
                                    </Nav.Dropdown.Item>
                                    <Nav.Dropdown.Item as={Link} to="/AllGroups">
                                        Seznam
                                    </Nav.Dropdown.Item>

                                </Nav.Dropdown>
                                <Nav.Dropdown title={"Akce"}>
                                    <Nav.Dropdown.Item as={Link} to="/NewAction">
                                        Nová
                                    </Nav.Dropdown.Item>
                                    <Nav.Dropdown.Item as={Link} to="/AllActions">
                                        Seznam
                                    </Nav.Dropdown.Item>
                                </Nav.Dropdown>
                                <Nav.Item as={Link} to={"/Applications"}>
                                    Přihlášky
                                </Nav.Item>
                            </Nav>
                        ) : profile.lector ? (
                            <Nav>
                                <Nav.Dropdown title={"Skupiny"}>
                                    <Nav.Dropdown.Item as={Link} to="/NewGroup">
                                        Nová
                                    </Nav.Dropdown.Item>
                                    <Nav.Dropdown.Item as={Link} to="/AllGroups">
                                        Seznam
                                    </Nav.Dropdown.Item>

                                </Nav.Dropdown>
                                <Nav.Dropdown title={"Akce"}>
                                    <Nav.Dropdown.Item as={Link} to="/NewAction">
                                        Nová
                                    </Nav.Dropdown.Item>
                                    <Nav.Dropdown.Item as={Link} to="/AllActions">
                                        Seznam
                                    </Nav.Dropdown.Item>
                                </Nav.Dropdown>
                            </Nav>
                        ) : null : null
                    }
                    <Nav pullRight>
                        {
                            accessToken ?
                                <Nav.Dropdown title={profile.preferred_username}>
                                    <Nav.Dropdown.Item as={Link} to="/Profile">Profil</Nav.Dropdown.Item>
                                    <Nav.Dropdown.Item as={Link} to={"/EditUser"}>Upravit</Nav.Dropdown.Item>
                                </Nav.Dropdown>
                                : isUserLoading ?
                                    <Spinner size={"sm"} />
                                    : null
                        }
                        {
                            userManager ?
                                accessToken ?
                                    <Nav.Item as={Link} to="/log-out" onClick={() => { userManager.signoutRedirect() }}>Odhlásit</Nav.Item> :
                                    <Nav.Item as={Link} to="/log-in" onClick={() => { userManager.signinRedirect({ redirectUrl: "/" }) }}>Přihlásit se</Nav.Item> :
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