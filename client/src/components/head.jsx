import useEth from "../contexts/EthContext/useEth";
import { Navbar, NavbarBrand, NavbarText, Button } from 'reactstrap';
import './head.css';

const Head = ( { isVoter, isOwner }) => {
   
  const { state: { accounts} } = useEth();
  
  const connect = async () => {
    if (window.ethereum) {
      try {
        /*const tmpAccounts =*/ await window.ethereum.request({ method: "eth_requestAccounts" });
        window.location.reload();
      } catch (err) {
        console.log('erreur de connexion')
        console.log(err)
      }
    } else {
     console.log('No wallet');
    }
  }

  return (
    <>
      <Navbar className="me-auto" color="light" light>
        <NavbarBrand href="/">
          <img alt="logo" src="images/vote-icon.png" className="navbar-icon" />
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
              {accounts && (accounts[0])}
              </span>
            </>
            ) : ( 
                Array.isArray(accounts) && accounts.length > 0 ? (
                <>
                <span>
                  Visitor
                </span>
                <span>
                {accounts && (accounts[0])}
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