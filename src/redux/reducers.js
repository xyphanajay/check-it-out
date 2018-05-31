import {
  actionType,
  addRef,
  checkLog,
  checkoutRef,
  getRefs,
  nextRemote,
  previousRemote
} = require('./actions');

const INITIAL_STATE = {
  currentBranch: 'local',
  refs: [],
};

export const reducer = (state = INITIAL_STATE, action) => { // state = initial state?
  const {
    refs: currentRefs
  } = state;

  switch (action.type) {
    case actionType.ADD_REF:
      // Prior to spreading newRefs into refs, we should format the payload
      const payload = typeof action.payload === 'string'
        ? Array.of(action.payload)
        : action.payload;

      console.log(payload);

      // Need to add formatting to this reducer

      const refs = [...currentRefs, ...newRefs]

      return {...state, refs}

    case actionType.CHECK_LOG: // Dispatch action to execute spawn git log instead?
      return {...state}

    case actionType.CHECKOUT_REF:
      return {...state}

    case actionType.CLEAR_REFS:
      return {...state}

    case actionType.GET_CURRENT_BRANCH:
      return {...state, currentBranch: action.payload}

    case actionType.GET_REFS:
      return {...state}

    case actionType.NEXT_REMOTE:
      return {...state}

    case actionType.PREVIOUS_REMOTE:
      return {...state}

    default:
      return state;
  }
};
