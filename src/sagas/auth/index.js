/**
 * Copyright 2017 Yuichiro Tsuchiya
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { fork, call, put, take, select, cancel, race } from 'redux-saga/effects';

import {
  loginSuccess,
  REQUEST_SIGNUP,
  REQUEST_LOGIN,
  REQUEST_ANONYMOUS_LOGIN,
  REQUEST_LOGOUT,
  requestLogin,
  logoutSuccess,
  alertError,
  alertInfo,
  setIsDBPublic,
} from '../../actions';
import { btoa as _btoa } from '../../utils';

import authedSagas from './authed-sagas';
import adminSaga from '../admin';

let authedTask = null;

export function checkAccessibility(db: PouchInstance) {
  return db.info()
    .then(() => ({ accessibility: true }))
    .catch(error => ({
      accessibility: false,
      error,
    }));
}

export function* afterLoggedIn(db: PouchInstance) {
  for (let i = 0; i < authedSagas.length; ++i) {
    yield fork(authedSagas[i], db);
  }

  const session = yield call([db, db.getSession]);
  const { name, roles } = session.userCtx;

  let meta = null;
  if (name) {
    const user = yield call([db, db.getUser], name);
    meta = user.asha || null;
  }

  const isAdmin = roles.includes('_admin');
  if (isAdmin) {
    yield fork(adminSaga);
  }

  yield put(loginSuccess(name, roles, meta));
}

export function* logout(db: PouchInstance) {
  try {
    yield call([db, db.logout]);
  } catch (error) {
    console.log(error);
  }

  yield put(logoutSuccess());

  if (authedTask) {
    yield cancel(authedTask);
  }
}

export function* authorize(db: PouchInstance, username: string, password: string) {
  const ajaxOpts = {
    ajax: {
      headers: {
        Authorization: `Basic ${_btoa(`${username}:${password}`)}`,
      },
    },
  };

  try {
    const response = yield call([db, db.login], username, password, ajaxOpts);
    return { response };
  } catch (error) {
    return { error };
  }
}

export function* loginFlow() {
  while (true) {
    const { payload } = yield take(REQUEST_LOGIN);

    const db = yield select(state => state.db.instance);
    if (!db) {
      console.log('Not connected');
      continue;
    }

    const { username, password } = payload;

    const winner = yield race({
      auth: call(authorize, db, username, password),
      logout: take(REQUEST_LOGOUT),
    });

    if (winner.auth) {
      const { response, error } = winner.auth;
      if (response) {
        authedTask = yield fork(afterLoggedIn, db);
        yield put(alertInfo('Logged in!'));
      } else {
        yield put(alertError(`Failed to log in: ${error.message || ''}`));
      }
    } else if (winner.logout) {
      yield call(logout, db);
    }
  }
}

export function* anonymousLoginFlow() {
  while (true) {
    yield take(REQUEST_ANONYMOUS_LOGIN);

    const db = yield select(state => state.db.instance);
    if (!db) {
      console.log('Not connected');
      continue;
    }

    const { accessibility, error } = yield call(checkAccessibility, db);
    if (!accessibility) {
      if (error.status === 401) {
        yield put(alertError('This DB is not public'));
        yield put(setIsDBPublic(false));
      } else {
        yield put(alertError('Disconnected'));
      }
      continue;
    }

    authedTask = yield fork(afterLoggedIn, db);
    yield put(alertInfo('Logged in as an anonymous user'));
  }
}

export function * alreadyLoggedIn(db: PouchInstance) {
  authedTask = yield fork(afterLoggedIn, db);
}

export function* signupFlow() {
  while (true) {
    const { payload } = yield take(REQUEST_SIGNUP);
    const db = yield select(state => state.db.instance);

    if (!db) {
      console.log('Not connected');
      continue;
    }

    const { username, password, andLogin } = payload;
    const option = {
      metadata: {
        roles: ['staff'],
      },
    };

    try {
      yield call([db, db.signup], username, password, option);
      yield put(alertInfo('Success'));
      if (andLogin) {
        yield put(requestLogin(username, password));
      }
    } catch (error) {
      if (error.name === 'conflict') {
        yield put(alertError(`"${username}" already exists, choose another username`, 5000));
      } else if (error.name === 'forbidden') {
        yield put(alertError('Forbidden', 5000));
      } else {
        yield put(alertError(`${error.name}: ${error.message || ''}`));
      }
    }
  }
}

export function * logoutFlow() {
  while (true) {
    yield take(REQUEST_LOGOUT);
    const db = yield select(state => state.db.instance);
    if (!db) {
      console.log('Not connected');
      continue;
    }
    yield call(logout, db);
  }
}
