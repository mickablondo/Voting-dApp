import useEth from "../contexts/EthContext/useEth";

import { Navbar, NavbarBrand,NavbarText } from 'reactstrap';
import './head.css';


const Head = ( { isVoter, isOwner }) => {

  const { state: { accounts } } = useEth();

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
              <>
              Disconnected
              </>
            )}
          </span>
        </NavbarText>
      </Navbar>
    </>
  )
}

export default Head