## Avoiding Common Attacks 

1) I did utilize best practices for sending money out of the smart contract. I followed the guidelines of "pull, don't push." In other words, instead of calling "winner.transfer(address(this).balance) in the submit function, I force the winner to call the withdraw function manually. This not only allows the submit function to not rely on the execution of an external function call (perhaps the receving contract would revert and ruin the integretity of the transaction), but also allows the receiver of the funds to specify which account to send the funds. While it is not an issue with Ether, this would be helpful if the smart contract accepted ERC20 tokens as payments, as it would allow the winner to only send the tokens to an address that is capable of interacting with the ERC 20 token smart contract. 


2) I gave special functionality to the creator of the game. The creator, set as the owner of the smart contract through the Open Zeppelin Ownable.sol smart contract, is able to call emergencyShutOff(), which prevents new money from entering the smart contract and allows users to withdraw the funds that they have submitted to the smart contract. Should their be a bug discovered in the code, this will allow users to withdraw their funds in a safe manner.


3) No use of tx.orgin. Instead I use msg.sender, as bad actors can take advantage of tx.origin

4) This smart contract is vulnerable to miners executing their authority to alter time based logic and sensor the transactions that they choose to include in the block they mine. If a miner is registered as LastClicker in the smart contract, then he is incentivized to not include any further calls to the game smart contract until the clock has expired. This is now a known vunlerability. It will be interesting to see if users continue to pump money into this game or if the only reason that users continue to play FOAM3D is because the pot has grown so large and they have invested enough money into the game that it is too costly not to continue playing.

