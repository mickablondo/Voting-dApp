import useEth from "../contexts/EthContext/useEth";
import { Navbar, NavbarBrand, NavbarText, Button } from 'reactstrap';
import './head.css';
import Web3 from "web3";

const Head = ( { isVoter, isOwner }) => {

  const { state: { accounts, web3 } } = useEth();

  const connect = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      window.web3 = new Web3(window.ethereum);
      const account = web3.eth.accounts;
      const walletAddress = account.givenProvider.selectedAddress;
      console.log(`Wallet: ${walletAddress}`);
    } else {
     console.log('No wallet');
    }
  }

  return (
    <>
      <Navbar className="me-auto" color="light" light>
        <NavbarBrand href="/">
          <img alt="logo" src="/images/vote-icon.png" className="navbar-icon" />
          Voting
        </NavbarBrand>
        <NavbarText> 
          <span id="navbar-right-text">
            {isVoter || isOwner ? (
            <>
              <span>
                [ {isOwner && ("Owner") }{isOwner && isVoter?", ":" "}{isVoter && ("Voter") } ]
              </span>
              <span>
              {accounts[0]}
              </span>
            </>
            ) : ( 
              Array.isArray(accounts) ? (
                <>
                <span>
                  Visitor
                </span>
                <span>
                  {accounts[0]}
                </span>
                </>
              ) : (
              <>
                <Button color="primary" onClick={connect}>Connect Wallet</Button>
              </>
            ))}
          </span>
        </NavbarText>
      </Navbar>
    </>
  )
}

export default Head