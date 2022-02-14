import React, { Component } from 'react';
import { Routes, Route } from "react-router-dom";
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';

import './custom.css'
import { AuthProvider } from './providers/AuthProvider';
import { Paths } from './configuration/main';
import SignInCallback from './components/Auth/SignInCallback';
import SignOutCallback from './components/Auth/SignOutCallback';
import SilentRenewCallback from './components/Auth/SilentRenewCallback';
import NotFound from './components/general/NotFound';
import Profile from './components/UsersComponents/ProfileComponent';
import Users from './components/UsersComponents/Users';
import AllActions from './components/ActionsComponents/AllActions';
import AllGroups from './components/GroupsComponents/AllGroups';
import NewAction from './components/ActionsComponents/NewAction';


export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <AuthProvider>
          <Layout>
            <Routes>
              <Route path={Paths.LoginCallback} element={<SignInCallback />} />
              <Route path={Paths.LogoutCallback} element={<SignOutCallback />} />
              <Route path={Paths.RenewCallback} element={<SilentRenewCallback />} />
              <Route index path='/' element={<Home />} />
              <Route path='/counter' element={<Counter />} />
              <Route path='/fetch-data' element={<FetchData />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/Users" element={<Users />} />
              <Route path="/AllActions" element={<AllActions />} />
              <Route path="/NewAction" element={<NewAction />} />
              <Route path="/AllGroups" element={<AllGroups />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
      </AuthProvider>
    );
  }
}
