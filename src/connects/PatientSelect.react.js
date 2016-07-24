import { connect } from 'react-redux';
import {
  fetchPatientList,
} from '../actions';
import {
  filterPatientList,
} from '../selectors';

import { subscribe } from '../db';

const mapStateToProps = (state) => ({
  isFetching: state.status.isFetchingPatientList,
  patientList: filterPatientList(state),
});

const mapDispatchToProps = (dispatch) => ({
  fetchPatientList: () => dispatch(fetchPatientList()),
  subscribeChange: () => subscribe('change', (/* change */) => {
    dispatch(fetchPatientList());  // TODO 全件fetchし直すのは効率が悪い
  }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
