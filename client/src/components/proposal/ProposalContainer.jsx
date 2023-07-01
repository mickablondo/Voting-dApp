import { Card, CardTitle } from "reactstrap";
import AddProposal from "./ProposalControl";
import ListProposal from "./ProposalList";
import { EnumWorkflowStatus } from "../EnumWorkflowStatus";

import './ProposalContainer.css'
import StateIcon from "../stateIcon/StateIcon";


const ProposalComponent = ({ proposalsState, currentStatus, votersHaveVoted }) => {

  return ( 
    <Card body id="proposal-container">
        <CardTitle tag="h5"> 
          Proposals 
          &nbsp;
          <StateIcon enabled={currentStatus === EnumWorkflowStatus.ProposalsRegistrationStarted} /> 
        </CardTitle>
        <AddProposal currentStatus={currentStatus}/>
        <ListProposal proposalsState={proposalsState} currentStatus={currentStatus} votersHaveVoted={votersHaveVoted}/>
    </Card> 
  )
}

export default ProposalComponent