import { connect } from 'react-redux';
import {
  fetchPatientList,
  requestLogout,
} from '../actions';
import {
  getSortedFilteredPatientList,
} from '../selectors';

import { subscribe } from '../db';

const mapStateToProps = (state) => ({
  isFetching: state.status.isFetchingPatientList,
  patientList: getSortedFilteredPatientList(state),
});

const mapDispatchToProps = (dispatch) => ({
  fetchPatientList: () => dispatch(fetchPatientList()),
  subscribeChange: () => subscribe('change', (/* change */) => {
    dispatch(fetchPatientList());  // TODO 全件fetchし直すのは効率が悪い
  }),
  logout: () => dispatch(requestLogout()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
