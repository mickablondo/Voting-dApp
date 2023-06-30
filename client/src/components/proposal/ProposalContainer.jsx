import { Card, CardTitle } from "reactstrap";
import AddProposal from "./ProposalControl";
import ListProposal from "./ProposalList";

import './ProposalContainer.css'

const ProposalComponent = ({ proposalsState, currentStatus, votersHaveVoted }) => {

  return ( 
    <Card body id="proposal-container">
        <CardTitle tag="h5"> Proposals </CardTitle>
        <AddProposal currentStatus={currentStatus}/>
        <ListProposal proposalsState={proposalsState} currentStatus={currentStatus} votersHaveVoted={votersHaveVoted}/>
    </Card> 
  )
}

export default ProposalComponent