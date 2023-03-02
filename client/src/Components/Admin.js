import React, { Component } from 'react'
import Election from '../contracts/Election.json'
import getWeb3 from '../getWeb3'

import NavigationAdmin from './NavigationAdmin'
import Navigation from './Navigation'

class Admin extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      isOwner: false,
      pollsList: null,
      pollsCount: 0,
    }
  }

  startElection = async (prompt) => {
    await this.state.ElectionInstance.methods
      .startElection(prompt)
      .send({ from: this.state.account, gas: 1000000 })

    window.location.reload(false)
  }

  endElection = async (prompt) => {
    await this.state.ElectionInstance.methods
      .endElection(prompt)
      .send({ from: this.state.account, gas: 1000000 })

    window.location.reload(false)
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
        web3: web3,
        account: accounts[0],
      })

      const owner = await this.state.ElectionInstance.methods.getOwner().call()

      if (this.state.account === owner) {
        this.setState({ isOwner: true })
      }

      let pollsCount = await this.state.ElectionInstance.methods
        .getPollsNumber()
        .call()

      this.setState({ pollsCount: pollsCount })

      let pollsList = []

      for (let pollIndex = 0; pollIndex < pollsCount; pollIndex++) {
        let poll = await this.state.ElectionInstance.methods
          .pollsDetails(pollIndex)
          .call()

        pollsList.push(poll)
      }

      this.setState({ pollsList: pollsList })
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      )
      console.error(error)
    }
  }

  render() {
    let pollsList = []

    if (this.state.pollsList) {
      pollsList = this.state.pollsList.map((poll) => {
        return (
          <div className="col d-flex justify-content-center" key={poll.prompt}>
            <div className="col-lg-6">
              <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">
                    {poll.prompt}
                  </h6>
                </div>

                <div className="card-body">
                  <div className="m-0 font-weight-bold text-primary">
                    Candidate 1: {poll.candidate1.name}
                  </div>
                  <br></br>
                  <div className="m-0 font-weight-bold text-primary">
                    Candidate 2: {poll.candidate2.name}
                  </div>
                  <br></br>
                  {poll.start ? (
                    <button className="btn btn-primary">
                      <span className="text">Start voting</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => this.startElection(poll.prompt)}
                      className="btn btn-primary"
                    >
                      <span className="text">Start voting</span>
                    </button>
                  )}
                  &nbsp;&nbsp;&nbsp;
                  {poll.end ? (
                    <button className="btn btn-primary">
                      <span className="text">End voting</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => this.endElection(poll.prompt)}
                      className="btn btn-primary"
                    >
                      <span className="text">End voting</span>
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
        <div>
          {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
          <center><h4 className="m-0 font-weight-bold text-danger">
            Only the admin can see this configuration!
          </h4></center>
        </div>
      )
    }

    return (
      <div className="App">
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
        <br></br>
        <br></br>

        {pollsList.length === 0 ? (
          <h4 className="m-0 font-weight-bold text-danger">
            No polls created yet!
          </h4>
        ) : (
          pollsList
        )}
      </div>
    )
  }
}

export default Admin
