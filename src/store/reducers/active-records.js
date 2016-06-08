import {
  SUCCESS_FETCH_PATIENT,
} from '../../actions'

export default (state = [], action) => {
  switch (action.type) {
    case SUCCESS_FETCH_PATIENT:
      return action.records

    default:
      return state
  }
}
