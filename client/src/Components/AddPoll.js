import React, { Component } from 'react'
import Election from '../contracts/Election.json'
import getWeb3 from '../getWeb3'

import NavigationAdmin from './NavigationAdmin'
import Navigation from './Navigation'

class addPoll extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      candidate1Name: '',
      candidate2Name: '',
      candidate1URL: '',
      candidate2URL: '',
      prompt: '',
      candidates: null,
      isOwner: false,
    }
  }

  updateName1 = (event) => {
    this.setState({ candidate1Name: event.target.value })
  }

  updateURL1 = (event) => {
    this.setState({ candidate1URL: event.target.value })
  }

  updateName2 = (event) => {
    this.setState({ candidate2Name: event.target.value })
  }

  updateURL2 = (event) => {
    this.setState({ candidate2URL: event.target.value })
  }

  updatePrompt = (event) => {
    this.setState({ prompt: event.target.value })
  }

  // When addPoll function is invoked,
  // it sends a transaction from your account with some gas against instance-methods-<name of function>.
  addPoll = async () => {
    const image_input_1 = document.querySelector('#image_input_1')
    const image_input_2 = document.querySelector('#image_input_2')

    let candidate1Image, candidate2Image

    image_input_1.addEventListener('change', function () {
      const reader = new FileReader()

      reader.addEventListener('load', () => {
        const uploaded_image = reader.result
        console.log(URL.createObjectURL(uploaded_image))
      })

      reader.readAsDataURL(this.files[0])

      candidate1Image = URL.createObjectURL(reader.result)
    })

    image_input_2.addEventListener('change', function () {
      const reader = new FileReader()

      reader.addEventListener('load', () => {
        const uploaded_image = reader.result
        console.log(URL.createObjectURL(uploaded_image))
      })

      reader.readAsDataURL(this.files[0])

      candidate2Image = URL.createObjectURL(reader.result)
    })

    this.setState({
      candidate1URL: candidate1Image,
      candidate2URL: candidate2Image,
    })

    await this.state.ElectionInstance.methods
      .addPoll(
        this.state.candidate1Name,
        this.state.candidate2Name,
        this.state.candidate1URL,
        this.state.candidate2URL,
        this.state.prompt,
      )
      .send({
        from: this.state.account,
        gas: 1000000,
      })

    // Reload the page at last so that all the states come back to initial state
    // window.location.reload(false);
  }

  componentDidMount = async () => {
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

    if (!this.state.isOwner) {
      return (
        <div>
          {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}
          <center>
            <h4 className="m-0 font-weight-bold text-danger">
              Only the admin can see this configuration!
            </h4>
          </center>
        </div>
      )
    }

    return (
      <div className="App">
        {this.state.isOwner ? <NavigationAdmin /> : <Navigation />}

        <h4 class="m-0 font-weight-bold text-primary">Add poll</h4>

        <div class="container">
          <div class="col d-flex justify-content-center">
            <div class="col-lg-8">
              <div class="card o-hidden border-0 shadow-lg my-5">
                <div class="card-body p-0">
                  <div class="p-4">
                    <form class="user">
                      <div class="form-group">
                        <label>
                          <strong>Enter the poll title</strong>
                        </label>
                        <input
                          class="form-control form-control-user"
                          placeholder="e.g.: Who will win the match today?"
                          value={this.state.prompt}
                          onChange={this.updatePrompt}
                        ></input>
                      </div>

                      <div class="row">
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <div class="form-group">
                          <label>
                            <strong>Enter first candidate's name</strong>
                          </label>
                          <input
                            class="form-control form-control-user"
                            value={this.state.candidate1Name}
                            onChange={this.updateName1}
                          ></input>
                        </div>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <div class="form-group">
                          <label>
                            <strong>Enter second candidate's name</strong>
                          </label>
                          <input
                            class="form-control form-control-user"
                            value={this.state.candidate2Name}
                            onChange={this.updateName2}
                          ></input>
                        </div>
                      </div>

                      <div class="row">
                        &nbsp;&nbsp;&nbsp;
                        <div class="form-group">
                          <label>
                            <strong>Enter first candidate's image URL</strong>
                          </label>
                          <input
                            class="form-control form-control-user"
                            value={this.state.candidate1URL}
                            onChange={this.updateURL1}
                          ></input>
                          <div className="form-input">
                            {/* <input
                                  type="file"
                                  id="image_input_1"
                                  accept="image/png, image/jpg, image/jpeg"
                          ></input> */}
                          </div>
                        </div>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <div class="form-group">
                          <label>
                            <strong>Enter second candidate's image URL</strong>
                          </label>
                          <input
                            class="form-control form-control-user"
                            value={this.state.candidate2URL}
                            onChange={this.updateURL2}
                          ></input>
                          <div className="form-input">
                            {/* <input
                                  type="file"
                                  id="image_input_2"
                                  accept="image/png, image/jpg, image/jpeg"
                          ></input> */}
                          </div>
                        </div>
                      </div>
                    </form>

                    <div class="row" style={{ display: 'none' }}>
                      &nbsp;&nbsp;&nbsp;
                      <div className="form-input">
                        <input
                          type="file"
                          id="image_input_1"
                          accept="image/png, image/jpg, image/jpeg"
                        ></input>
                      </div>
                      <div className="form-input">
                        <input
                          type="file"
                          id="image_input_2"
                          accept="image/png, image/jpg, image/jpeg"
                        ></input>
                      </div>
                    </div>

                    <button
                      onClick={this.addPoll}
                      class="btn btn-primary btn-icon-split"
                    >
                      <span class="icon text-white-50">
                        <i class="fa fa-user-plus"></i>
                      </span>
                      <span class="text">Add poll</span>
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

export default addPoll
