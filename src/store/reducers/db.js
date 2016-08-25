/* @flow */

import {
  DB_SET_INSTANCE,
} from '../../actions';

const defaultHost = (typeof location !== 'undefined' && location.hostname)
  ? location.hostname
  : '127.0.0.1';
const defaultPouchConfig: PouchConfig = {
  isLocal: false,
  local: {
    dbname: 'asha-fusion-dev',
    isSynced: false,
  },
  remote: {
    hostname: `${defaultHost}:5984`,
    dbname: 'asha-fusion-dev',
  },
};

const initialState: DBState = {
  instance: null,
  config: defaultPouchConfig,
};

export default function (state: DBState = initialState, action: DBAction) {
  switch (action.type) {
    case DB_SET_INSTANCE:
      return {
        ...state,
        instance: action.payload.instance,
      };

    default:
      return state;
  }
}