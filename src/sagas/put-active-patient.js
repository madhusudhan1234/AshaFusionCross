import { take, put, call, select } from 'redux-saga/effects';
import { browserHistory } from 'react-router';
import {
  PUT_ACTIVE_PATIENT,
  requestPutPatient,
  successPutPatient,
  failurePutPatient,
  setActivePatient,
  alertInfo,
  alertError,
} from '../actions';

import { db } from '../db';

export function* putActivePatient() {
  yield put(requestPutPatient());

  const patient = yield select(state => state.activePatient);

  const now = (new Date()).getTime();  // Unix Millisecond Timestamp

  try {
    const res = yield call([db, db.put], {
      $created_at: now,
      ...patient,
      $updated_at: now,
    });
    if (!res.ok || res.id !== patient._id) {
      throw new Error('Invalid response');
    }

    yield put(setActivePatient({
      ...patient,
      _rev: res.rev,
    }));

    yield put(alertInfo('Patient data updated'));

    // Router (No effect on native)
    yield call([browserHistory, browserHistory.replace], `/patient/${patient._id}`);

    yield put(successPutPatient());
  } catch (error) {
    yield put(alertError('Failed updating patient data'));
    yield put(failurePutPatient(error));
  }
}

export function* watchPutActivePatient() {
  while (true) {
    yield take(PUT_ACTIVE_PATIENT);
    yield call(putActivePatient);
  }
}
