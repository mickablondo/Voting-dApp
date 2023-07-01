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
  const eventsChangedSubscriptionRef = useRef(false);

  const init = useCallback(
    async (artifact)  => {
   
      if (artifact) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        const { abi } = artifact;
        let address, contract, owner;
        try {
          if (typeof (artifact.networks[networkID]) !== 'undefined') {
            address = artifact.networks[networkID].address;
            contract = new web3.eth.Contract(abi, address);

            // Récupération du owner
            owner = await contract.methods.owner().call();
            
            console.log("contract owner is:" + owner);
            console.log("accounts: " , accounts); 
            
            dispatchWeb3State({
              type: WEB3_STATE_ACTIONS.INIT,
              data: { artifact, web3, accounts, networkID, contract, owner }
            });
          } else {
            console.log("Bad network!"); 
          }

        } catch (err) {
          console.error(err);
        }
 
      } else {
        console.log("No artifact! you could be disconnected!");
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
    const handleChainChanged = (chainId) => {
      // reloading the page upon chain changes - see https://docs.metamask.io/wallet/reference/provider-api/
        window.location.reload();
    };
    const handleAccountChanged = (accountId) => {
      console.log(`account changed to ${accountId} ()`);
      dispatchWeb3State({ type: WEB3_STATE_ACTIONS.ACCOUNT_CHANGE});
      init(web3State.artifact, WEB3_STATE_ACTIONS.ACCOUNT_CHANGE);
    };
    if (!eventsChangedSubscriptionRef.current) {
      eventsChangedSubscriptionRef.current = true;
      window.ethereum.on("chainChanged", handleChainChanged);
      window.ethereum.on("accountsChanged", handleAccountChanged);
    }
    return () => {
      if (eventsChangedSubscriptionRef.current) {
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        window.ethereum.removeListener("accountsChanged", handleAccountChanged);
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
