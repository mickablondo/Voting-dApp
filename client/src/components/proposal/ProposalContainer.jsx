import { Card, CardTitle } from "reactstrap";
import AddProposal from "./ProposalControl";
import ListProposal from "./ProposalList";

import './ProposalContainer.css'

const ProposalComponent = ({ proposalsState, currentStatus }) => {

  return ( 
    <Card body id="proposal-container">
        <CardTitle tag="h5"> Proposals </CardTitle>
        <AddProposal currentStatus={currentStatus}/>
        <ListProposal proposalsState={proposalsState} currentStatus={currentStatus}/>
    </Card> 
  )
}

export default ProposalComponent