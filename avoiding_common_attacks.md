1) I decided that I did not need to add increased gas expenses to this smart contract by utilizing safe math. This is because it would be infeasible for any of the numbers in the smart contract to surpass 2^256 - 1. 


2) I did utilize best practices for sending money out of the smart contract. I followed the guidelines of "pull, don't push." In other words, instead of calling "winner.transfer(address(this).balance) in the submit function, I force the winner to call the withdraw function manually. This not only allows the submit function to not rely on the execution of an external function call (perhaps the receving contract would revert and ruin the integretity of the transaction), but also allows the receiver of the funds to specify which account to send the funds. While it is not an issue with Ether, this would be helpful if the smart contract accepted ERC20 tokens as payments, as it would allow the winner to only send the tokens to an address that is capable of interacting with the ERC 20 token smart contract. 


3) I gave special functionality to the creator of the game. The creator, set as the owner of the smart contract through the Open Zeppelin Ownable.sol smart contract, is able to call emergencyShutOff(), which prevents new money from entering the smart contract and allows users to withdraw the funds that they have submitted to the smart contract. Should their be a bug discovered in the code, this will allow users to withdraw their funds in a safe manner.


4) No use of tx.orgin. Instead I use msg.sender, as bad actors can take advantage of tx.origin

