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
import EditUser from './components/UsersComponents/EditUser';
import NewGroup from './components/GroupsComponents/NewGroup';
import EditGroup from './components/GroupsComponents/EditGroup';
import GroupDetail from './components/GroupsComponents/GroupDetail';
import EditAction from './components/ActionsComponents/EditAction';
import ActionDetail from './components/ActionsComponents/ActionDetail';


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
              <Route path='/log-in' element={<Home />} />
              <Route path='/log-out' element={<Home />} />
              
              <Route path="/Profile" element={<Profile />} />
              <Route path="/Users" element={<Users />} />
              <Route path="/EditUser/:mail" element={<EditUser /> } />
              <Route path="/EditUser" element={<EditUser /> } />
              
              <Route path="/AllActions" element={<AllActions />} />
              <Route path="/NewAction" element={<NewAction />} />
              <Route path="/EditAction/:year/:actionId" element={<EditAction />} />
              <Route path="/Action/:year/:nameId" element={<ActionDetail />} />

              <Route path="/NewGroup" element={<NewGroup />} />
              <Route path="/AllGroups" element={<AllGroups />} />
              <Route path="/EditGroup/:year/:actionId/:groupId" element={<EditGroup />} />
              <Route path="/Group/:year/:actionId/:groupId" element={<GroupDetail />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
      </AuthProvider>
    );
  }
}
