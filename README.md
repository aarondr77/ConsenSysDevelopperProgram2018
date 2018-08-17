## The Game
The object of this game is to be the last person to send ether to the smart contract. When the game is initialized, 1000 seconds is set on the clock. Each time ether is sent to the contract, time is added. The more ether you send, the less time is added. If you are the last person to send money to the contract when the time runs out, simply send one more transaction to the contract to claim your funds. It could be millions!

Don't worry, your funds are safe. If there is an explotation, the deployer of the contract can halt all actions and allow users to withdraw any funds that they have depositted.

## Inspiration
This game is highly inspired by [Fomo3D](https://exitscam.me/shakedown), a game "built to simulate the standard hype -> release -> pump -> dump: cycles of the countless ICO exit scams across the cryptocurrency space."

## Implementation 

#### adopt


 * @dev allows a user to become the lastCaller iff the clock has not run out
 
 ```
 function adopt() public payable;
 ```
 
 #### getAdopters
 
  * @dev returns the address of the winner; 0 if no winner yet
  * @return address of winner
  
```
function getAdopters() public view returns (address);
```
  
  #### checkCurrentEndTime
  
   * @dev returns the time remaining on the clock
   * @return time remaining on clock
     
```
function checkCurrentEndTime () public view returns (uint);
```
    
  #### getSubmitions  
   
   * @dev returns the total number of submitions
   * @return the number of submitions to the smart contract
     
    
```
function getSubmitions() public view returns(uint);
```
    
   #### withdrawRewards
    
   * @dev allows a user to withdraw his rewards if he is the winner or if the contract has been cancelled, allows user to withdraw the amount of ether that he depositted.

``` 
function withdrawRewards(address to) public;
```
    
   #### emergencyShutOff
   
   * @dev allows the owner of the contract to stop future submitions
    
``` 
function emergencyShutOff() public onlyOwner();
```
## Run it

If you do not have the [MetaMask] (https://metamask.io/) chrome extension, get it [here](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en)

If you do not have [Ganache](https://truffleframework.com/ganache) installed, install it. 

```
1) Launch Ganache
```

Create a local folder where you want to host the code. 

```
2) Download this github repo
```

Navigate into your locally saved version of this repo via terminal

```
3) Truffle Compile
```

Back in terminal, run 

```
4) Truffle Migrate
```

Now in MetaMask, 

```
5) Select, "Import Existing DEN" and copy and paste your wallet seed into the provided box on MetaMask. Make a password.
```

```
6) Click on "Main Network" to open up a dropdown menu of newtworks to connect to. Select, "Custom RPC"
```

```
7) Enter, "http://127.0.0.1:7545" and select "save"
```

MetaMask is now ready.

```
8) Back in terminal, type "npm run dev" to start the local web server
```

You should see the game appear in your chrome browser. 

Enjoy. 
