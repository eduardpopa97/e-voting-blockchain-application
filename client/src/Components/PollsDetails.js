import React, { Component } from 'react'
import Election from '../contracts/Election.json'
import getWeb3 from '../getWeb3'

import '../index.css'

import NavigationAdmin from './NavigationAdmin'
import Navigation from './Navigation'

class PollsDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      candidateCount: 0,
      candidateList: null,
      pollsCount: 0,
      promptsList: null,
      pollsList: null,
      loaded: false,
      isOwner: false,
    }
  }

  changeCandidates = async (prompt) => {
    localStorage.setItem('prompt', prompt)

    for (let pollIndex = 0; pollIndex < this.state.pollsCount; pollIndex++) {
      let poll = this.state.pollsList[pollIndex]

      if (poll.prompt === prompt) {
        localStorage.setItem('Candidate1Name', poll.candidate1.name)
        localStorage.setItem('Candidate1URL', poll.candidate1.url)
        localStorage.setItem('Candidate1Votes', poll.candidate1.voteCount)
        localStorage.setItem('Candidate1ID', poll.candidate1.candidateId)

        localStorage.setItem('Candidate2Name', poll.candidate2.name)
        localStorage.setItem('Candidate2URL', poll.candidate2.url)
        localStorage.setItem('Candidate2Votes', poll.candidate2.voteCount)
        localStorage.setItem('Candidate2ID', poll.candidate2.candidateId)

        break
      }
    }

    window.location = 'http://localhost:3000/PoolingStation'
    console.log(window.location.href)
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

      let candidateCount = await this.state.ElectionInstance.methods
        .getCandidateNumber()
        .call()

      // Retrieve number of polls
      let pollsCount = await this.state.ElectionInstance.methods
        .getPollsNumber()
        .call()

      this.setState({ candidateCount: candidateCount, pollsCount: pollsCount })

      let candidateList = [],
        promptsList = [],
        pollsList = []

      // Retrieve the candidates
      for (
        let candidateIndex = 0;
        candidateIndex < candidateCount;
        candidateIndex++
      ) {
        let candidate = await this.state.ElectionInstance.methods
          .candidateDetails(candidateIndex)
          .call()

        candidateList.push(candidate)
      }

      // Retrieve the polls prompts
      for (let pollIndex = 0; pollIndex < pollsCount; pollIndex++) {
        let prompt = await this.state.ElectionInstance.methods
          .pollsPrompts(pollIndex)
          .call()

        let poll = await this.state.ElectionInstance.methods
          .pollsDetails(pollIndex)
          .call();

        promptsList.push(prompt)

        pollsList.push(poll)
      }

      this.setState({
        candidateList: candidateList,
        promptsList: promptsList,
        pollsList: pollsList,
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
    let pollsList = [];
    let active = 'Active', inactive = 'Inactive';

    if (this.state.pollsList)
    {
      pollsList = this.state.pollsList.map((poll) => {
        return (
          <div className="App" key={poll.prompt}>
            <br></br>
            <div className="col d-flex justify-content-center">
              <div className="col-lg-6">
                <div className="card shadow mb-4">
                  <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary">
                      {poll.prompt}
                    </h6>
                  </div>

                  <div className="card-body">
                    <h5 className="m-0 font-weight-bold text-primary">
                      Candidate 1: {poll.candidate1.name}
                    </h5>
                    <h5 className="m-0 font-weight-bold text-primary">
                      Candidate 2: {poll.candidate2.name}
                    </h5>
                    <h5 className="m-0 font-weight-bold text-primary">
                      Status: {poll.start ? active : inactive}
                    </h5>

                    <br></br>

                    <button
                      onClick={() => this.changeCandidates(poll.prompt)}
                      className="btn btn-primary btn-icon-split"
                    >
                      <span className="icon text-white-50">
                        <i className="fas fa-poll"></i>
                      </span>
                      <span className="text">Check poll details</span>
                    </button>
                  </div>
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

    return (
      <div className="CandidateDetails">
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}

        <h4 className="m-0 font-weight-bold text-primary">
          Total number of polls created: {this.state.pollsCount}
        </h4>

        <br></br>
        <div>{pollsList}</div>
      </div>
    )
  }
}

export default PollsDetails
