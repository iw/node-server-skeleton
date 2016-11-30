'use strict';

const {Authorization, Session} = require('../../domain/models');
const {eitherToFuture, maybeToFuture} = require('../../util/future');
const {verifyTokenPair, createTokenPair} = require('./_util');
const validate = require('../../util/validate');
const Future = require('fluture');
const error = require('http-errors');
const {pipe, concat, prop, fromMaybe, get} = require('sanctuary-env');
const {chain, apply, map} = require('ramda');

//    userNotFound :: NotAuthorizedError
const userNotFound = error(403, 'User provided by token does not exist');

//    arrof :: a -> Array a
const arrof = x => [x];

//    verifyTokens :: Monad m => (m AuthorizationToken, m RefreshToken) -> m Session
const verifyTokens = (token, refresh) =>
  chain(apply(verifyTokenPair), concat(map(arrof, token), map(arrof, refresh)));

module.exports = (req, res) => Future.do(function*() {

  //    findUserByName :: UserId -> Future NotFoundError User
  const findUserByName = pipe([
    req.services.users.get,
    chain(maybeToFuture(userNotFound))
  ]);

  const auth = yield validate(Authorization, req.body);

  const session = yield eitherToFuture(verifyTokens(
    req.services.token.decode(auth.token),
    req.services.token.decode(auth.refresh)
  )).chain(validate(Session));

  const user = yield findUserByName(session.user);

  const [token, refresh] = yield createTokenPair(req.services.token.encode, {
    user: prop('username', user),
    groups: fromMaybe([], get(Array, 'groups', user))
  });

  res.cookie('token', token, {
    path: '/',
    maxAge: yield req.services.config('security.tokenLife')
  });

  return Authorization({token, refresh});

});
