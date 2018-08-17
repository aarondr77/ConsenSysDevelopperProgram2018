pragma solidity ^0.4.24;

import "./Ownable.sol";


contract Adoption is Ownable {

    bool public breakSwitch = false;

    address public winner;

    uint256 public currentEndTime;
    address public lastCaller;
    bool public finished;

    uint public numberOfSubmitions;

    mapping (address => uint) public etherBalances;


    event Winner(address winner);
    event TimeUpdated(uint timeUpdated);
    event GameCancelled();

    constructor () public {
        currentEndTime = now + 1000 seconds;
    }

    function () payable {
        // accept ether
    }

    /**
      * @dev allows a user to become the lastCaller iff the clock has not run out
      */
    function adopt() public payable {

        require(!finished);
        if (currentEndTime < now) {
            winner = lastCaller; 
            etherBalances[msg.sender] += msg.value;
            finished = true;
            emit Winner(msg.sender);
        } else {
            uint timeIncrease = 1000 / msg.value;
            currentEndTime += timeIncrease;
            lastCaller = msg.sender;
            emit TimeUpdated(timeIncrease);
        }
        etherBalances[msg.sender] += msg.value;
        numberOfSubmitions++;
    }

    /**
     * @dev returns the address of the winner; 0 if no winner yet
     *
     * @return address of winner
     */
    function getAdopters() public view returns (address) {
        return winner;
    }

    /**
     * @dev returns the time remaining on the clock
     *
     *
     * @return time remaining on clock
     */
    function checkCurrentEndTime () public view returns (uint) {
        return currentEndTime;
    }

    /**
     * @dev returns the total number of submitions
     *
     * @return the number of submitions to the smart contract
     */
    function getSubmitions() public view returns(uint) {
        return numberOfSubmitions;
    }

    /**
     * @dev allows a user to withdraw his rewards if he is the winner or if
     *    the contract has been cancelled, allows user to withdraw the amount
     *    of ether that he depositted.
     */
    function withdrawRewards(address to) public {
        require(msg.sender == winner || breakSwitch);
        if (msg.sender == winner) {
            to.transfer(address(this).balance);
        } else if (breakSwitch) {
            uint amount = etherBalances[msg.sender];
            etherBalances[msg.sender] = 0;
            to.transfer(amount);
        }
    }

    /**
     *@dev allows the owner of the contract to stop future submitions
     */
    function emergencyShutOff() public onlyOwner() {
        breakSwitch = true;
        emit GameCancelled();
    }

    

}