import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';

import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import withAuthorization from '../Session/withAuthorization';

const AccountPage = ({ sessionStore }) =>
  <div>
    <h1>Hello, {sessionStore.authUser.displayName}</h1>
    <p>Account: {sessionStore.authUser.email}</p>    
    <PasswordForgetForm />
    <PasswordChangeForm />
  </div>

const authCondition = (authUser) => !!authUser;

export default compose(
  withAuthorization(authCondition),
  inject('sessionStore'),
  observer
)(AccountPage);


// finding the avatar ... sessionStore.authUser. ->
// refreshToken, uid, displayName, photoURL, email, emailVerified,
// phoneNumber, isAnonymous, metadata, providerData
