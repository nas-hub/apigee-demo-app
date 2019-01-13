# IdP based End-User Authentication : OIDC

The solution is based on the Reference Architecture “IdP based End-User Authentication". 
[![N|Solid](https://study.com/cimages/multimages/16/data-center-architecture.jpg)](https://study.com/cimages/multimages/16/data-center-architecture.jpg)
> Refer to this [decision graph](https://todo) to know when to use this Reference Architecture.

## Architecture Modules
### Identity provider (IdP)
* [PingFederate]() 
* [Okta]()
* [Google I&AM]()
* Any Identity provider that supports [OIDC](https://openid.net/developers/specs/)
### User Agent
* [Single Page Application]()
* [Smart client based Web Application]()
* [Native Mobile Application]()
### API Platform
* [Apigee](www.apigee.com)

## Solution Sequence Flow
[![N|Solid](https://study.com/cimages/multimages/16/data-center-architecture.jpg)](https://study.com/cimages/multimages/16/data-center-architecture.jpg)
### Sequence Flow Steps
**Step 1** : End-User initiates Application activity. This could be the very first time End-User accesses the App.
**Step 2**: User Agent checks if the Access_Token is already present and is valid. In this case this check fails and User Agent starts an Access_Token request against Apigee. The User Agent does so by passing Apigee issued Client_ID for the App.
**Step 3**: Apigee identifies the Client_ID and looks up the configured Identity Provider. Based on the Identity Providers metadata, Apigee initiates a OpenId Connect handshake.
**Step 4**: The Identity Provider authenticates the End User in SSO fashion. After successful Authentication issues Access_Token and Id_Toke to Apigee.
**Step 5**: Apigee Leverages the User Info provided by identity Provider and creates Apigee OAuth Access Token.
**Step 6**: This Access_Token will be used going forward to request APIs on behalf of the EndUser.

Note: If you need all the glory details about the above high level interaction please refer to [this]() detailed sequence flow.

## Installation Instructions:
### Pre-Requisites
1. Identity Provider: You need your Identity Provider have Apigee registered as OpenId Connect relying party.
-- Refer the setup for Identity Providers like [Okta](), [Ping]() and [Google]().
2. Maven In Path: Make sure you have installed and configured Maven in the path.
3. Apigee Org name and Environment: Ensure you have access to Apigee Org with needed permissions in which you want to deploy this solution.

### Installation Steps:
1. [Download]() the solution pack.
2. Navigate to the sownloaded solution pack, and edit it the **idp.config** file located in the root folder.

| Property | Description |
| ------ | ------ |
| idp.client.id.value | This is the Client_Id representing Apigee at your Identity provider. |
| idp.client.secret.value| This is the Client_Secret issued by Identity Provider for Apigee.|
| idp.issuer.value| This is the Issuer value that represents your Identity Provider.|
| idp.hostname.value| Fully qualified domain name of the Identity Provider, this should be the same host name that corresponds to you Identity provides OpenID endpoints.|
| idp.atz_code.endpoint.value| This is the Authorization Code grant type endpoint of the identity Provider. Ensure that you skip the leading and trailing slashes.|
| idp.audience.value| The Audience value configured by your Identity Provider.|
| idp.redirect_uri.value| This corresponds to the Redirect URI value that you will configure on your Identity Provider that represents an Endpoint for OpenId Connect Callback. This endpoint is created in your Apigee Org as a part of this installation. Ex:  https://<your apigee hostname>/v1/idp/oidc/cb|
3. Apart from these required properties, there are few optional properties you might want to update on need basis. Please review them here.
4. Make sure that you have maven tool in your command path. 
5. Run the install.sh script providing your Apigee Org Name Apigee Username and Password in that order. 
``` Ex: ./install.sh <your_org_name> <your_username> <your_password>. ```
The default environment this solution will be deployed is test. If you want it to be deployed in a different environment, you will update the pom.xml file accordingly.
6. Once the install script is complete, you should have this solution installed in your org and ready to be tested.

## Testing Instructions
1. As part of the install script, an API Product and App is created for you for testing purposes. Lookup it's client_id from the App named “IdentityDemoApp”.
2. Construct the Token Link as follows:  
``` https://<your apigee hostname>/v1/idp/authorize?client_id=<The Client_ID of the IdentityDemoApp> ```
3. Open a new browser session preferable in incognito mode. Navigate to the above endpoint from the browser. This will prompt you for login using Identity Provides Login process. Once you provide valid credentials and are successfully authenticated, you will see on the screen the Access_Token provided to you by Apigee.
4. Using that Acess_Token you should be able to access APIs that are allowed for this Application.

