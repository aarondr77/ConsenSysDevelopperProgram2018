App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider;
    } else {
        // If no injected web3 instance is detected, fall back to Ganache
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Adoption.json', function(data) {

      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);
      console.log("deployed to", App.contracts.Adoption);
      //App.contracts.Adoption = web3.eth.contract.new(AdoptionArtifact, {from: accounts[0]});
    
      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);
      
    
      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.form-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {

    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;

        console.log("Get Adopters", adoptionInstance.getAdopters.call());
        var periodNumber = adoptionInstance.getPeriod.call();
        console.log("Period Number", periodNumber.valueOf());

        return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      console.log(adopters);
      if (adopters !== '0x0000000000000000000000000000000000000000') {
          console.log("TUN OFF");
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
      }
      
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleAdopt: function(event) {

    event.preventDefault();
  
    var adoptionInstance;

    var x = document.getElementById("frm1");
    var ethValue = x.elements[0].value

    web3.eth.getAccounts(function(error, accounts) {
    if (error) {
        console.log(error);
    }

    var account = accounts[0];

    App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;

        // Execute adopt as a transaction by sending account
        adoptionInstance.adopt({from: account, value: ethValue * 1e18});
    }).then(function(result) {
        return App.markAdopted();
    }).catch(function(err) {
        console.log(err.message);
    });
    });
  }
};

  $(function() {
    $(window).load(function() {
      App.init();
    });
  });



