import { Form, Row, Col, Input, Button } from 'reactstrap';
import useEth from "../../contexts/EthContext/useEth";
import { useState } from 'react';

const GetVoterControl = () => {

    const [getVoterInputState, setGetVoterInputState] = useState("");
    const [voterInfo, setVoterInfo] = useState();
    const { state: {  accounts, contract } } = useEth();

    const onGetVoterInputChange = (value) => {
        setGetVoterInputState(value);
    };
    
    const isEthAddressFormat = (ethAddress) => { 
        return (/^0x[0-9a-fA-F]{40}$/.test(ethAddress));
    };

    const onGetVoterSubmit = async (e) => {
        // prevent default submit form action
        e.preventDefault(); 
    
        if (!isEthAddressFormat(getVoterInputState)) {
          alert(`Not an ethereum address:"${getVoterInputState}"`);
          return;
        }

        try {
            const voter = await contract.methods.getVoter(getVoterInputState).call({from: accounts[0]});
            console.log(voter)
            setVoterInfo(voter);
        } catch (error) {
            console.log(error)
        }
    };
    

    return (
    <>
        <Form onSubmit={onGetVoterSubmit} >
        <Row className="row-cols-lg-auto">
            <Col className="me-auto ">
            <Input name="voterAddress" placeholder="0x..." className="voter-address-input" type="text" 
                value={getVoterInputState}
                onChange={e => onGetVoterInputChange(e.target.value)}
            />
            </Col>
            <Col>
            <Button>Get info</Button>
            </Col>
        </Row> 
        </Form>

        { voterInfo ?
            voterInfo.isRegistered ?
                voterInfo.hasVoted ?
                    <span className="badge rounded-pill bg-info text-dark">The voter has voted for proposal : {voterInfo.votedProposalId}</span>
                : <span className="badge rounded-pill bg-warning text-dark">The voter has not voted yet.</span>
            : <span className="badge rounded-pill bg-danger">It's not a voter !</span>
        : <span></span>}
    </>
    )
}

export default GetVoterControl