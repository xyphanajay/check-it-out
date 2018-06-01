import {
  actionType,
  addRef,
  addRemote,
  checkLog,
  checkoutRef,
  getRefs,
  nextRemote,
  previousRemote,
} from './actions';

const INITIAL_STATE = {
  currentBranch: 'local',
  refs: [],
  remotes: [],
};

export const reducer = (state = INITIAL_STATE, action) => {
  // state = initial state?
  const { refs: currentRefs, remotes: currentRemotes } = state;

  switch (action.type) {
    case actionType.ADD_REF:
      // Prior to spreading newRefs into refs, we should format the payload
      const newRefs =
        typeof action.payload === 'string'
          ? Array.of(action.payload)
          : action.payload;

      // newRefs = formatting.

      // format payload here

      // Need to add formatting to this reducer
      refs = [...currentRefs, ...newRefs];

      return { ...state, refs };

    case actionType.ADD_REMOTE:
      const newRemotes =
        typeof action.payload === 'string'
          ? Array.of(action.payload)
          : action.payload;

      const remotes = [...currentRemotes, ...newRemotes];

      console.log('remotes = ', remotes);

      return { ...state, remotes };

    case actionType.CHECK_LOG: // Dispatch action to execute spawn git log instead?
      return { ...state };

    case actionType.CHECKOUT_REF:
      return { ...state };

    case actionType.CLEAR_REFS:
      return { ...state };

    case actionType.GET_CURRENT_BRANCH:
      return { ...state, currentBranch: action.payload };

    case actionType.GET_REFS:
      return { ...state };

    case actionType.NEXT_REMOTE:
      return { ...state };

    case actionType.PREVIOUS_REMOTE:
      return { ...state };

    default:
      return state;
  }
};
