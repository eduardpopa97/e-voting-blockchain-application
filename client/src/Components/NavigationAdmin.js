import React, { Component } from 'react'

import '../vendor/fontawesome-free/css/all.min.css'
import '../css/sb-admin-2.min.css'

class NavigationAdmin extends Component
{
  render()
  {
    return (
      <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
        <h4 className="m-0 font-weight-bold text-primary">Admin Portal</h4>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a href="/">
          <h6 className="m-0 font-weight-bold text-primary">Home</h6>
        </a>
        <a href="/PollsDetails">
          <h6 className="m-0 font-weight-bold text-primary">View polls</h6>
        </a>
        <a href="/VerifyVoter">
          <h6 className="m-0 font-weight-bold text-primary">Verify voter</h6>
        </a>
        <a href="/AddPoll">
          <h6 className="m-0 font-weight-bold text-primary">Add a new poll</h6>
        </a>
        <a href="/Admin">
          <h6 className="m-0 font-weight-bold text-primary">Start or end voting</h6>
        </a>
      </nav>
    )
  }
}

export default NavigationAdmin
