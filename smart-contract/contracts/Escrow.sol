// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import '@openzeppelin/contracts/access/AccessControl.sol';

contract Escrow is AccessControl{
    enum State {INIT, AGENT_CONDITION, PAYMENT_RECEIVED, COMPLETE}
	State public state = State.INIT;

    address payable public agent;
	address payable public seller;
	address payable public buyer;
	bool public conditionMet = false;

	bytes32 public constant BUYER_ROLE = keccak256("BUYER_ROLE");
    bytes32 public constant SELLER_ROLE = keccak256("SELLER_ROLE");
    bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");
	uint256 public constant AGENT_FEE_PERCENTAGE = 10;

	constructor(address payable sellerAddress, address payable buyerAddress) {
		seller = sellerAddress;
		buyer = buyerAddress;

		_setupRole(SELLER_ROLE, seller);
		_setupRole(BUYER_ROLE, buyer);
	}

    modifier satisfyState(State stateToCheck) {
		require(state == stateToCheck);
		_;
	}

    receive() external payable onlyRole(BUYER_ROLE) satisfyState(State.AGENT_CONDITION) {
		require(msg.value > 0, "Escrow amount must be greater than 0");
		changeState(State.PAYMENT_RECEIVED);
	}

	function changeState(State newState) private {
		state = newState;
	}

	function chooseAgent(address payable _agent) external onlyRole(BUYER_ROLE) 
        satisfyState(State.INIT) {
	
		agent = _agent;
		_setupRole(AGENT_ROLE, agent);

		changeState(State.AGENT_CONDITION);
	}

    function setCondition() public onlyRole(AGENT_ROLE) {
        conditionMet = true;
    }

	function releaseFunds() external onlyRole(AGENT_ROLE) satisfyState(State.PAYMENT_RECEIVED) {
        require(conditionMet, 'Condition is not fulfilled');
		uint256 releaseAmount = (address(this).balance * (100 - AGENT_FEE_PERCENTAGE)) / 100;
        uint256 commitionAmount = (address(this).balance * AGENT_FEE_PERCENTAGE) / 100;

        seller.transfer(releaseAmount);
        agent.transfer(commitionAmount);

        changeState(State.COMPLETE);
		resetState();
	}

	function revertFunds() external onlyRole(AGENT_ROLE) satisfyState(State.PAYMENT_RECEIVED) {
        require(!conditionMet, 'Condition must not be fulfilled');

		uint256 releaseAmount = address(this).balance;
		buyer.transfer(releaseAmount);

        changeState(State.COMPLETE);
		resetState();
	}

	function resetState() private onlyRole(AGENT_ROLE) satisfyState(State.COMPLETE) {
		changeState(State.INIT);
		renounceRole(AGENT_ROLE, agent);
	}
}