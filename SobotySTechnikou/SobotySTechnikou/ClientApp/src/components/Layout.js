import React, { Component } from 'react';
import { Col, Container, Content, Footer, Header, Row } from 'rsuite';
import { NavMenu } from './NavMenu';

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <Container>
        <Row>
          <Col lg={2}></Col>
          <Col lg={20}>
            <Container>
              <Header><NavMenu /></Header>
              <Content>
                {this.props.children}
              </Content>
              <Footer></Footer>
            </Container>
          </Col>
          <Col lg={2}></Col>
        </Row>
      </Container>
    );
  }
}
