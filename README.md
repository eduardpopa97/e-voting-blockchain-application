# e-voting-blockchain-application

This application was implemented in order to allow users to have one out of two roles: usual user or
admin. The admin can give permission to a user to take part in a poll. Every user can initiate a poll by
completing a form which requests a poll title, the options (only 2 are allowed) and images to upload for
each option (as an URL). The user who initiated the poll can close it anytime and only after this moment
can see the results. The web interface is implemented using the ReactJS framework and for storing the
blockchain I made use of Ganache CLI. The smart contracts are created by integrating the Truffle
framework which also allows creating unit tests.
