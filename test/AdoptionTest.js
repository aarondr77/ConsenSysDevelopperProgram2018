var assert = require('chai').assert;
const expectThrow = require('./ExpectThrow.js');
const timeTravel = require('./TimeTravel.js');
var Web3Utils = require('web3-utils');

const Adoption = artifacts.require('Adoption.sol');


contract ('LastToCall', (accounts) => {

    /**
     * Explanation of Tests: I wrote tests to cover the most crucial functionality of the smart contract. 
     * The game that is created by this smart contract relies on some basic logic, ie: that last person to submit
     * a transaction should be set as the lastCaller and if a transaction is submitted after the clock 
     * has run out, then the lastCaller should be set as the winner. Finally, only the winner should be able 
     * to withdraw funds. 
     * 
     * This is the basic functionality of the smart contract that I needed to ensure worked accuretly. 
     */

    let instance;

    beforeEach(async() => {
        instance = await Adoption.new({from: accounts[0]});
    })

    it ('should increase currentEndTime if Adopt is called before now > currentEndTime', async () => {
        const initEndTime = await instance.checkCurrentEndTime.call();
        await instance.adopt({from: accounts[0], value: 1});
        const newEndTime = await instance.checkCurrentEndTime.call();
        await assert.equal(initEndTime.toNumber() + 1000, newEndTime.toNumber());
    })

    it ('should set lastCaller to winner if now > currentEndTime', async () => {
        await instance.adopt({from: accounts[0], value: 1});
        await timeTravel(5000);
        await instance.adopt({from: accounts[1], value: 1});
        const winner = await instance.getAdopters.call();
        await assert.equal(winner, accounts[0]);

    })

    it ('should set lastCaller to msg.sender, but not winner if now < currentEndTime', async () => {
        await instance.adopt({from: accounts[0], value: 1});
        const lastCaller = await instance.lastCaller.call();

        const winner = await instance.winner.call();
        
        await assert.equal(lastCaller, accounts[0]);
        await assert.notEqual(winner, accounts[0]);

    })

    it ('should only allow the winner to set BreakSwitch = true', async () => {
        await expectThrow(instance.emergencyShutOff({from: accounts[1]}));
        const result = await instance.breakSwitch();
        await console.log(result);
        await assert.isFalse(result);

        await instance.emergencyShutOff({from: accounts[0]});
        const resultTwo = await instance.breakSwitch();
        await assert.isTrue(resultTwo);

    }) 
    
    it ('should only allow winner to withdraw funds', async () => {

        await instance.adopt({from: accounts[0], value: 1});
        await instance.adopt({from: accounts[1], value: 20});
        await instance.adopt({from: accounts[2], value: 10});
        await instance.adopt({from: accounts[0], value: 1});

        await timeTravel(100000);
        await expectThrow(instance.withdrawRewards(accounts[0], {from: accounts[0]}));
        await expectThrow(instance.withdrawRewards(accounts[1], {from: accounts[1]}));

        await instance.adopt({from: accounts[0], value: 1});

        await expectThrow(instance.withdrawRewards(accounts[1], {from: accounts[1]}));

        await instance.withdrawRewards(accounts[0], {from: accounts[0]});
    })

    it ('should allow all parties to withdraw funds if the breakSwitch is turned on', async () => {
        await instance.adopt({from: accounts[0], value: 1});
        await instance.adopt({from: accounts[1], value: 20});
        await instance.adopt({from: accounts[2], value: 10});
        await instance.adopt({from: accounts[0], value: 1});

        await instance.emergencyShutOff();

        await instance.withdrawRewards(accounts[0], {from: accounts[0]});
        await instance.withdrawRewards(accounts[1], {from: accounts[1]});
        await instance.withdrawRewards(accounts[2], {from: accounts[2]});

    })
})
