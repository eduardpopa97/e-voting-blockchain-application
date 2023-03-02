import React, { Component } from 'react';
import Election from '../contracts/Election.json';
import getWeb3 from '../getWeb3';

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';

import BlockVoteLogo from '../assets/blockvotelogo.svg';

class Home extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      isOwner: false,
    };
  }

  componentDidMount = async () => {
    // FOR REFRESHING PAGE ONLY ONCE -
    if (!window.location.hash) {
      window.location = window.location + '#loaded'
      window.location.reload()
    }

    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3()

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts()

      // Get the contract instance.
      const networkId = await web3.eth.net.getId()

      const deployedNetwork = Election.networks[networkId]
      const instance = new web3.eth.Contract(
        Election.abi,
        deployedNetwork && deployedNetwork.address,
      )

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        ElectionInstance: instance,
        account: accounts[0],
        web3: web3,
      })

      const owner = await this.state.ElectionInstance.methods.getOwner().call()

      if (this.state.account === owner) {
        this.setState({ isOwner: true })
      }
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      )
      console.error(error)
    }
  }

  render() {
    if (!this.state.web3) {
      return (
        <div className="CandidateDetails">
          {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
          <h4 className="m-0 font-weight-bold text-primary">
            Loading Web3, accounts, and contract...
          </h4>
        </div>
      )
    }
    return (
      <div className="App">
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}

        <div className="home">
          <img
            style={{
              height: '25vh',
              width: '15vh',
            }}
            src={BlockVoteLogo}
            alt="Blockchain Vote Logo"
          ></img>
          <br></br>
          Blockchain Vote
          <h1>Express your opinion in a decentralized manner!</h1>
          
          <br></br>
          <br></br>
          
        </div>
        

        <div className="home">
        <h3>Project made by the incredible team &#128170; &#128526; &#128293;</h3>
          <br></br>
          Bidilă Timotei
          <br></br>
          Brăcăcescu Raluca
          <br></br>
          Broscoṭeanu David
          <br></br>
          Popa Eduard
          <br></br>
          Vasilică Bogdan
        </div>
      </div>
    )
  }
}

export default Home
