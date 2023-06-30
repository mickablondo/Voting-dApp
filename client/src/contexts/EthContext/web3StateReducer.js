const ACTIONS = {
  INIT: "INIT"
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
    default:
      throw new Error("Undefined reducer action type");
  }
};

export { ACTIONS, INITIAL_STATE, reducer };
