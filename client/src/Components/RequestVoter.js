import React, { Component } from 'react'
import Election from '../contracts/Election.json'
import getWeb3 from '../getWeb3'

import NavigationAdmin from './NavigationAdmin'
import Navigation from './Navigation'

class RequestVoter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      name: '',
      email: '',
      candidates: null,
      registered: false,
      isVerified: false,
      isOwner: false,
    }
  }

  updateName = (event) => {
    this.setState({ name: event.target.value })
  }

  updateEmail = (event) => {
    let email = event.target.value

    // var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    // if (email.match(mailformat))
    // {
    this.setState({ email: email })
    // }
    // else
    // {
    // alert(
    // `Please enter a valid email address and then try again!`,
    // );
    // }
  }

  addVoter = async () => {
    await this.state.ElectionInstance.methods
      .requestVoter(this.state.name, this.state.email)
      .send({
        from: this.state.account,
        gas: 1000000,
      })

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

      let registered, isVerified

      for (let voterIndex = 0; voterIndex < voterCount; voterIndex++)
      {
        let voterAddress = await this.state.ElectionInstance.methods
          .voters(voterIndex)
          .call()

        let voterDetails = await this.state.ElectionInstance.methods
          .voterDetails(voterAddress)
          .call()

        if (voterAddress === this.state.account)
        {
          registered = true
          isVerified = voterDetails.isVerified
          break
        }
      }

      this.setState({ registered: registered, isVerified: isVerified })

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

    if (this.state.registered && !this.state.isVerified)
    {
      return (
        <div className="CandidateDetails">
          {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
          <br></br>
          <br></br>
          <h4 className="m-0 font-weight-bold text-danger">
            You already requested to register!
          </h4>
        </div>
      );
    }

    if (this.state.isVerified)
    {
      return (
        <div className="CandidateDetails">
          {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
          <br></br>
          <br></br>
          <h4 className="m-0 font-weight-bold">
            You are verified! Go and vote in the desired poll!
            </h4>
        </div>
      );
    }

    return (
      <div className="App">
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}

        <h4 className="m-0 font-weight-bold text-primary">Enter your details to request access to voting!</h4>

        <div className="container">
          <div className="col d-flex justify-content-center">
            <div className="col-lg-6">
              <div className="card o-hidden border-0 shadow-lg my-5">
                <div className="card-body p-0">
                  <div className="p-4">
                    <form className="user">
                      <div className="form-group">
                        <label>
                          <strong>Enter your name</strong>
                        </label>
                        <input
                          className="form-control form-control-user"
                          value={this.state.name}
                          onChange={this.updateName}
                        ></input>
                      </div>
                      <div className="form-group">
                        <label>
                          <strong>Enter your email</strong>
                        </label>
                        <input
                          className="form-control form-control-user"
                          value={this.state.email}
                          onChange={this.updateEmail}
                        ></input>
                      </div>
                    </form>

                    <br></br>

                    <button
                      onClick={this.addVoter}
                      className="btn btn-primary btn-icon-split"
                    >
                      <span className="icon text-white-50">
                        <i className="fa fa-user-plus"></i>
                      </span>
                      <span className="text">Request to add voter</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default RequestVoter
