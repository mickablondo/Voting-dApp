import React, { useReducer, useCallback, useEffect, useRef } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { 
  reducer as web3StateReducer, 
  ACTIONS as WEB3_STATE_ACTIONS, 
  INITIAL_STATE as WEB3_INITIAL_STATE
} from "./web3StateReducer";

function EthProvider({ children }) {
  const [web3State, dispatchWeb3State] = useReducer(web3StateReducer, WEB3_INITIAL_STATE);
  const chainChangedSubscriptionRef = useRef(null);
  const eventsChangedSubscriptionRef = useRef(false);

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

            // refresh page network change
            if (chainChangedSubscriptionRef.current == null) {
              chainChangedSubscriptionRef.current = web3.currentProvider.on('chainChanged', (chainId) => window.location.reload());
            }

          } else {
            console.log("Bad network - no contract");
          }
        } catch (err) {
          console.error(err);
        }
        
        dispatchWeb3State({
          type: WEB3_STATE_ACTIONS.INIT,
          data: { artifact, web3, accounts, networkID, contract, owner }
        });
      } else {
        console.log("no artifact");
      }
    }, []);

  useEffect(() => {
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
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(web3State.artifact);
    };
 
    if (!eventsChangedSubscriptionRef.current) {
      eventsChangedSubscriptionRef.current = true;
      events.forEach(e => window.ethereum.on(e, handleChange));
    }
    return () => {
      if (eventsChangedSubscriptionRef.current) {
        events.forEach(e => window.ethereum.removeListener(e, handleChange));
        eventsChangedSubscriptionRef.current = false;
      }
    };
  }, [init, web3State.artifact]);

  return (
    <EthContext.Provider value={{
      state: web3State,
      dispatch: dispatchWeb3State
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
