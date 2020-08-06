## api-freshman-yr

Freshman Year is a prototype crowdsource-enabled micro-financing platform targeting undergraduate tuition and related expenses.

Sponsors can sign up, link their debit or credit card accounts and then direct spare change from everyday transaction to a selected scholar.

Scholars can have an unlimited number of sponsors, which can mean unlimited potential to build a fund to defray the cost of college tuition and other education expenses. 


## Third Party Integrations

 * Stripe
 * Plaid
 * Amazon Web Services (ECR, ECS, EC2, RDS)
 * _Mailgun_
 * _Redis_

 Items above marked in _italics_ are planned integrations.

## Local Development

1. Do `docker-compose up` The application will likely fail on the first attempt to initialize becasue it takes several seconds for the MySQL database container to spin up. As a result the `data_service` container that relies on the database will not load the API endpoints . 
2. When the logs indicate that the database is ready for incoming connections, do `docker-restart` on the `data_service` container. This flow is only required on the first startup. Subsequently you can just do `docker-compose up` once to set up the project.

## Notes

* Use the localTunnel package to expose the localhost interface publicly using `npm run localtunnel`
