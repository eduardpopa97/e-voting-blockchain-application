import React, { Component } from 'react'
import Election from '../contracts/Election.json'
import getWeb3 from '../getWeb3'

import NavigationAdmin from './NavigationAdmin'
import Navigation from './Navigation'

import '../index.css'

class VerifyVoter extends Component
{
  constructor(props)
  {
    super(props)

    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      votersList: null,
      isOwner: false,
    }
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

      // this.setState({ web3, accounts, contract: instance }, this.runExample);
      this.setState({
        ElectionInstance: instance,
        web3: web3,
        account: accounts[0],
      })

      let voterCount = await this.state.ElectionInstance.methods
        .getVoterCount()
        .call()

      let votersList = []

      for (let voterIndex = 0; voterIndex < voterCount; voterIndex++)
      {
        let voterAddress = await this.state.ElectionInstance.methods
          .voters(voterIndex)
          .call()
        
          let voterDetails = await this.state.ElectionInstance.methods
          .voterDetails(voterAddress)
          .call()

        votersList.push(voterDetails)
      }

      this.setState({ votersList: votersList })

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

  verifyVoter = async (event) => {
    await this.state.ElectionInstance.methods
      .verifyVoter(event.target.value)
      .send({ from: this.state.account, gas: 1000000 })

    window.location.reload(false)
  }

  render() {
    let votersList
    
    if (this.state.votersList)
    {
      votersList = this.state.votersList.map((voter) => {
        return (
          <div className="col d-flex justify-content-center" key={voter.voterAddress}>
            <div className="col-lg-6">
              <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">
                    {voter.name}
                  </h6>
                </div>

                <div className="card-body">
                  <div className="m-0 font-weight-bold text-primary">
                    Voter's address : {voter.voterAddress}
                  </div>
                  <div className="m-0 font-weight-bold text-primary">
                    Voter's email: {voter.email}
                  </div>
                  <br></br>

                  {voter.isVerified ? (
                    <button className="btn btn-primary btn-icon-split">
                      <span className="icon text-white-50">
                        <i className="fas fa-user-check"></i>
                      </span>
                      <span className="text">Voter verified</span>
                    </button>
                  ) : (
                    <button
                      onClick={this.verifyVoter}
                      value={voter.voterAddress}
                      className="btn btn-warning btn-icon-split">
                        <span className="icon text-white-50">
                          <i className="far fa-question-circle"></i>
                        </span>
                        &nbsp; Please check the user &nbsp;
                        <br></br>
                        &nbsp; before allowing to vote &nbsp;
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })
    }

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

    if (!this.state.isOwner) {
      return (
        <div className="CandidateDetails">
          {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
          <br></br>
          <br></br>
          <h4 className="m-0 font-weight-bold text-danger">
            Only the admin can see this configuration!
          </h4>
        </div>
      )
    }

    return (
      <div>
        <div className="CandidateDetails">
          {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
          <br></br>
          <br></br>
          
          {votersList.length === 0 ? (
            <h4 className="m-0 font-weight-bold text-danger">
              No voters registered yet!
            </h4>
            ) : (
              votersList
            )}
          
          <br></br>
          <br></br>
        </div>
      </div>
    )
  }
}

export default VerifyVoter
