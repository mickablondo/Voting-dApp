import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

 


  const init = useCallback(
    async artifact => {
      if (artifact) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        const { abi } = artifact;

        let address, contract, owner;
        try {
          if (typeof(artifact.networks[networkID]) !== 'undefined') {
            address = artifact.networks[networkID].address;
            contract = new web3.eth.Contract(abi, address);

            // Récupération du owner
            owner = await contract.methods.owner().call();
            console.log("owner is:"+ owner);
          } else {
            console.log("Bad network - no contract");
          }
        } catch (err) {
          console.error(err);
        }
        // refresh page on account or network change 
        if (typeof(artifact.networks[networkID]) !== 'undefined') {
          web3.currentProvider
          .on('accountsChanged', (accounts) => window.location.reload())
          .on('networkChanged', (networkId) => window.location.reload());
        }
        dispatch({
          type: actions.init,
          data: { artifact, web3, accounts, networkID, contract, owner }
        });
      } else {
        console.log("no artifact");
      }
    }, []);

  useEffect(() => {
    console.log("init");
    const tryInit = async () => {
      try {
        const artifact = require("../../contracts/Voting.json");
        init(artifact);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    console.log("chainChanged, accountsChanged");
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);

  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
