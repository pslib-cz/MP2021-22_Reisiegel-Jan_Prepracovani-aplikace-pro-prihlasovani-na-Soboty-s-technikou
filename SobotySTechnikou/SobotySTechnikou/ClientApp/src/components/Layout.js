import React, { Component } from 'react';
import { Col, Container, Content, Footer, Header, Row, Sidebar } from 'rsuite';
import { NavMenu } from './general/Menu/NavMenu';
import SideMenu from './general/Menu/SideMenu';

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <Container>
        <Header><NavMenu /></Header>
        <Content>
              <Row>
                <Col xs={1} sm={1} md={1} lg={2}>
                </Col>
                <Col xs={22} sm={22} md={22} lg={20} >
                  {this.props.children}
                </Col>
                <Col xs={1} sm={1} md={1} lg={2}>
                </Col>
              </Row>
        </Content>
        <Footer></Footer>
      </Container>
    );
  }
}
