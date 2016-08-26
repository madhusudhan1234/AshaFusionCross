/* eslint-env jest */

jest.unmock('redux-saga/effects');
jest.unmock('../../actions');
jest.unmock('../fetch-patient');

import { put, call } from 'redux-saga/effects';

import { db } from '../../db';
import {
  requestFetchPatient,
  successFetchPatient,
  failureFetchPatient,
  setActivePatient,
  setActiveRecords,
  selectActiveRecord,
  alertInfo,
  alertError,
} from '../../actions';
import {
  fetchPatient,
} from '../fetch-patient';

describe('fetchPatient saga', () => {
  it('calls db.get() with specified id then set current active-record', () => {
    const mockPatientId = 'patient_1234';
    const mockFetchedPatient = {
      _id: 'patient_1234',
      hoge: 'fuga',
    };
    const mockFetchedRecordDocs = {
      total_rows: 123,
      offset: 42,
      rows: [
        { _id: 'record_1234_1000', doc: { _id: 'record_1234_1000', foo: 'bar' } },
        { _id: 'record_1234_2000', doc: { _id: 'record_1234_2000', yo: 'ho' } },
      ],
    };

    const saga = fetchPatient(mockPatientId);

    expect(saga.next().value)
      .toEqual(put(requestFetchPatient()));

    expect(saga.next().value)
      .toEqual(call([db, db.get], mockPatientId));

    expect(saga.next(mockFetchedPatient).value)
      .toEqual(call([db, db.allDocs], {
        startkey: 'record_1234_',
        endkey: 'record_1234_\uffff',
        include_docs: true,
      }));

    expect(saga.next(mockFetchedRecordDocs).value)
      .toEqual(put(setActivePatient(mockFetchedPatient)));

    expect(saga.next().value)
      .toEqual(put(setActiveRecords(mockFetchedRecordDocs.rows.map(r => r.doc))));

    expect(saga.next().value)
      .toEqual(put(alertInfo('Patient data and records loaded')));

    expect(saga.next().value)
      .toEqual(put(successFetchPatient()));

    expect(saga.next().value)
      .toEqual(put(selectActiveRecord('record_1234_2000')));
  });

  it('handles error at fetching patient', () => {
    const mockPatientId = 'patient_1234';
    const mockError = {};

    const saga = fetchPatient(mockPatientId);

    expect(saga.next().value)
      .toEqual(put(requestFetchPatient()));

    expect(saga.next().value)
      .toEqual(call([db, db.get], mockPatientId));

    expect(saga.throw(mockError).value)
      .toEqual(put(alertError('Failed loading patient data and records')));

    expect(saga.next().value)
      .toEqual(put(failureFetchPatient(mockError)));
  });

  it('handles error at fetching records', () => {
    const mockPatientId = 'patient_1234';
    const mockError = {};
    const mockFetchedPatient = {
      _id: 'patient_1234',
      hoge: 'fuga',
    };

    const saga = fetchPatient(mockPatientId);

    expect(saga.next().value)
      .toEqual(put(requestFetchPatient()));

    expect(saga.next().value)
      .toEqual(call([db, db.get], mockPatientId));

    expect(saga.next(mockFetchedPatient).value)
      .toEqual(call([db, db.allDocs], {
        startkey: 'record_1234_',
        endkey: 'record_1234_\uffff',
        include_docs: true,
      }));

    expect(saga.throw(mockError).value)
      .toEqual(put(alertError('Failed loading patient data and records')));

    expect(saga.next().value)
      .toEqual(put(failureFetchPatient(mockError)));
  });
});