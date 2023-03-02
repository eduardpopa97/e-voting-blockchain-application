import React, { Component } from 'react'
import Election from '../contracts/Election.json'
import getWeb3 from '../getWeb3'

import NavigationAdmin from './NavigationAdmin'
import Navigation from './Navigation'

import DefaultPic from '../assets/default_candidate_pic.jpg'
import Versus from '../assets/versus.png'

import '../vendor/fontawesome-free/css/all.min.css'
import '../css/sb-admin-2.min.css'

class PoolingStation extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      candidate1Name: '',
      candidate1URL: '',
      candidate1VoteCount: 0,
      candidate1ID: 0,
      candidate2Name: '',
      candidate2URL: '',
      candidate2VoteCount: 0,
      candidate2ID: 0,
      prompt: '',
      currentVoter: null,
      hasVoted: false,
      isOwner: false,
      pollStart: false,
      pollEnd: false,
    }
  }

  vote = async (candidateId) => {
    if (!this.state.currentVoter)
    {
      alert(`Error occurred while trying to get the currently logged voter!`)
    }

    if (this.state.pollStart === false && this.state.pollEnd === true)
    {
      alert(`You cannot vote yet as the poll has ended!`)
    }
    else if (!this.state.pollStart && !this.state.pollEnd)
    {
      alert(`You cannot vote yet as the poll has not been started!`)
    }
    else if (this.state.pollStart === true && this.state.pollEnd === false)
    {
      if (this.state.isOwner)
      {
        if (!this.state.currentVoter.hasVoted)
        {
          await this.state.ElectionInstance.methods
            .voteAdmin(candidateId)
            .send({ from: this.state.account, gas: 1000000 })
        }
        else
        {
          alert(`You already casted your vote! Thank you!`)
        }
      }
      else
      {
        if (this.state.currentVoter.isVerified)
        {
          if (!this.state.currentVoter.hasVoted)
          {
            await this.state.ElectionInstance.methods
              .vote(candidateId)
              .send({ from: this.state.account, gas: 1000000 })
          }
          else
          {
            alert(`You already casted your vote! Thank you!`)
          }
        }
        else
        {
          alert(
            `You cannot vote yet as you have not been verified! Go to the verification page and register to vote!`,
          )
        }
      }
    }

    // Reload
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

      this.setState({
        ElectionInstance: instance,
        web3: web3,
        account: accounts[0],
        prompt: localStorage.getItem('prompt'),
      })

      let candidate1VoteCount, candidate2VoteCount
      let pollStart, pollEnd

      let pollsCount = await this.state.ElectionInstance.methods
        .getPollsNumber()
        .call()

      for (let pollIndex = 0; pollIndex < pollsCount; pollIndex++) {
        let poll = await this.state.ElectionInstance.methods
          .pollsDetails(pollIndex)
          .call()

        if (poll.prompt === this.state.prompt) {
          candidate1VoteCount = poll.candidate1.voteCount
          candidate2VoteCount = poll.candidate2.voteCount

          pollStart = poll.start
          pollEnd = poll.end
        }
      }

      this.setState({
        candidate1VoteCount: candidate1VoteCount,
        candidate2VoteCount: candidate2VoteCount,
        pollStart: pollStart,
        pollEnd: pollEnd,
      })

      this.setState({
        candidate1Name: localStorage.getItem('Candidate1Name'),
        candidate1URL: localStorage.getItem('Candidate1URL'),
        candidate1ID: localStorage.getItem('Candidate1ID'),

        candidate2Name: localStorage.getItem('Candidate2Name'),
        candidate2URL: localStorage.getItem('Candidate2URL'),
        candidate2ID: localStorage.getItem('Candidate2ID'),
      })

      console.log(this.state.candidate1URL)
      console.log(this.state.candidate2URL)

      const owner = await this.state.ElectionInstance.methods.getOwner().call()

      if (this.state.account === owner) {
        this.setState({ isOwner: true })
      }

      let currentVoter = await this.state.ElectionInstance.methods
        .voterDetails(this.state.account)
        .call()

      let hasVoted = currentVoter.hasVoted

      this.setState({ currentVoter: currentVoter, hasVoted: hasVoted })
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
      <div className="CandidateDetails">
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}

        <h4 className="m-0 font-weight-bold text-primary">{this.state.prompt}</h4>

        <br></br>
        <br></br>

        <div className="col d-flex justify-content-center">
          <div className="col-xl-9 col-lg-5">
            <div className="card shadow mb-4">
              <div className="card-body">
                <div className="card-body">
                  <div className="card" style={{ width: '18rem', float: 'left' }}>
                    <img
                      src={
                        this.state.candidate1URL.length === 0
                          ? DefaultPic
                          : this.state.candidate1URL
                      }
                      className="card-img-top"
                      style={{ height: '360' }}
                      alt="Candidate 1"
                    ></img>
                    <div className="card-body">
                      <h4>
                        <span
                          className="badge badge-primary"
                          style={{ width: '245px' }}
                        >
                          {this.state.candidate1Name}
                        </span>
                      </h4>
                      <br></br>
                      <h6 className="m-0 font-weight-bold text-primary">
                      {this.state.candidate1VoteCount === 1 ?
                          (this.state.candidate1VoteCount + " vote") :
                            (this.state.candidate1VoteCount + " votes")}
                      </h6>
                      <br></br>
                      <button
                        disabled={this.state.hasVoted}
                        onClick={() => this.vote(this.state.candidate1ID)}
                        className="btn btn-primary btn-icon-split"
                      >
                        <span className="icon text-white-50">
                          <i className="fas fa-vote-yea"></i>
                        </span>
                        <span className="text">
                          Vote
                        </span>
                      </button>
                    </div>
                  </div>

                  <img src={Versus} style={{ height: '50', width: '50', padding: '50px 20px 50px' }} alt="Versus"></img>
                  
                  <div className="card" style={{ width: '18rem', float: 'right' }}>
                    <img
                      src={
                        this.state.candidate2URL.length === 0
                          ? DefaultPic
                          : this.state.candidate2URL
                      }
                      className="card-img-top"
                      alt="Candidate 2"
                    ></img>
                    <div className="card-body">
                      <h4>
                        <span
                          className="badge badge-danger"
                          style={{ width: '245px' }}
                        >
                          {this.state.candidate2Name}
                        </span>
                      </h4>
                      <br></br>
                      <h6 className="m-0 font-weight-bold text-danger">
                        {this.state.candidate2VoteCount === 1 ?
                          (this.state.candidate2VoteCount + " vote") :
                            (this.state.candidate2VoteCount + " votes")}
                      </h6>
                      <br></br>
                      <button
                        disabled={this.state.hasVoted}
                        onClick={() => this.vote(this.state.candidate2ID)}
                        className="btn btn-danger btn-icon-split"
                      >
                        <span className="icon text-white-50">
                          <i className="fas fa-vote-yea"></i>
                        </span>
                        <span className="text">
                          Vote
                        </span>
                      </button>
                    </div>
                  </div>

                  <br></br>
                  <br></br>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PoolingStation
