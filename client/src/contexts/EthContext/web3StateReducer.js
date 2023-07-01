const ACTIONS = {
  INIT: "INIT", 
  ACCOUNT_CHANGE: "ACCOUNT_CHANGE",
};

const INITIAL_STATE = {
  artifact: null,
  web3: null,
  accounts: null, 
  networkID: null,
  contract: null
};

const reducer = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case ACTIONS.INIT:
      return { ...state, ...data }; 
    case ACTIONS.ACCOUNT_CHANGE:
      return { ...state, accounts: null };
    default:
      throw new Error("Undefined reducer action type");
  }
};

export { ACTIONS, INITIAL_STATE, reducer };
