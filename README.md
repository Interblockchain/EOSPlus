# EOSPlus
A small library which interfaces the actions of the basic Transledger C++ contract deployed on various EOS chains.
In order to do so, we must first login into a wallet using the [eos-transit package](https://github.com/eosnewyork/eos-transit/tree/master/packages/eos-transit#basic-usage-example) and gain the required authorities for teh accounts performing the actions. 
They are all bunched here for easy access, easy modification and to give a uniform convention for the different recurrent quantities.

#Installation
In the working directory, simply issue:

`npm install --save EOSPlus`

# Usage

Simply import the module and construct a new instance by passing the connection parameters to the constructor.

```javascript
const EOSPlus = require("EOSPlus");

let params = {
    contractAddress: "ibclcontract",  //Account where the Transledger contract is deployed (usually: ibclcontract) 
    network: {
        host: "jungleapi.eossweden.se",   // RPC API Endpoint for the EOS chain
        port: null,                       // Port of the API Endpoint
        protocol: 'https',                // HTTP Connection protocol to the API Endpoint
        chainId: "e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473"  // ChainId of the EOS chain (this example is for JUNGLE)
    }
};
const eosplus = new EOSPlus(params);
```

Then you can invoke the methods, like for example:

```javascript
let value = eosplus.transferfrom(wallet, from, to, spender, amount, decimals, symbol, memo);
```

# Basic Contract Methods
## Create cryptocurrency
```javascript
create(wallet: Wallet, issuer: string, max_supply: string, decimals, symbol: string) 
```
This method is used for creating new cryptocurrencies on the blockchain. As of now, it can only be called by the owner of the
account on which the contract is deployed (that is to say: it can only be called by Transledger).

### Parameters:
* wallet: transit-eos wallet object which provide keys for the account performing the action (in this case, the account that deployed the contract)
* issuer: account which will be able to issue tokens of this currency and transfer initial amounts 
* max_supply: maximum supply which can be issued for this currency
* decimals: number of decimals to use for this currency,
* symbol: symbol used to identify this currency (ex: TBTC).

## Issue tokens
```javascript
issue(wallet: Wallet, to: string, quantity, decimals, symbol: string, memo: string)
```
This method is used for issuing currency. Once the cryptocurrency is created, the specified issuer can use this method to mint a specified amount of tokens and send them to an account. 

### Parameters:
* wallet: transit-eos wallet object which provide keys for the account performing the action (in this case, the issuer of the currency)
* to: account which will receive the issued tokens
* quantity: amount of tokens issued
* decimals: number of decimals used for the currency
* symbol: symbol of the currency
* memo: a memo

## Transfer funds
```javascript
transfer(wallet: Wallet, from: string, to: string, quantity, decimals, symbol: string, memo: string)
```
Transfer funds from one account to another. 

### Parameters:
* wallet: transit-eos wallet object which provide keys for the account performing the action
* from: account sending the funds (authorization for this account must be provided in wallet)
* to: account which will receive the tokens
* quantity: amount of tokens transferred
* decimals: number of decimals used for the currency
* symbol: symbol of the currency
* memo: a memo

## Transferfrom
```javascript
transferfrom(wallet: Wallet, from: string, to: string, spender: string, quantity, decimals, symbol: string, memo: string)
```
Third party can use this method to transfer funds in the name of the owner. To be able to use this method, the owner of the funds must have previously approved the spender using the approve method.

### Parameters:
* wallet: transit-eos wallet object which provide keys for the action
* from: account sending the funds
* to: account which will receive the tokens
* spender: account which has authority to make the transfer (authorization for this account must be provided in wallet)
* quantity: amount of tokens transferred
* decimals: number of decimals used for the currency
* symbol: symbol of the currency
* memo: a memo

## Approve spender
```javascript
approve(wallet: Wallet, owner: string, spender: string, quantity, decimals, symbol: string)
```
Preapprove a spender to transfer up to a specified amount of funds in your name.

### Parameters:
* wallet: transit-eos wallet object which provide keys for the action
* owner: account possessing the tokens (authorization for this account must be provided in wallet)
* spender: account to give authority to 
* quantity: amount of tokens 'spender' can transfer
* decimals: number of decimals used for the currency
* symbol: symbol of the currency

## Get Balance
```javascript
getBalance(account: string, symbol: string)
```
Returns all the balances of the account. If a symbol is passed, returns only the balance in the specified cryptocurrency.

### Parameters:
* account: account possessing the tokens
* symbol:  symbol of the currency (optional)

## Get Allowance
```javascript
getAllowance(account: string, spender: string, symbol: string)
```
Returns all the allowances of the account. If a spender is passed, returns only the allowances for this spender.
If a symbol is passed, returns only the allowances in the specified cryptocurrency.

### Parameters:
* account: account possessing the table
* spender: account which has permission to spend (optional)
* symbol: symbol of the currency (optional) 

# Exchange Methods
## Create Order
```javascript
createOrder(wallet, user, sender, baseAmount, baseDecimals, baseSymbol, counterAmount, counterDecimals, counterSymbol, feesAmount, memo, expires)
```
This method is used for creating a new order on the blockchain. It must be called with the authority of the specified user. 

### Parameters:
* wallet: transit-eos wallet object which provide keys for the account performing the action (in this case: user)
* user: account of the user creating the order (authorization for this account must be provided in wallet)
* sender: account of the relayer (exchange) which will get the commission (fees) for this order 
* baseAmount: amount of tokens offered by 'user'
* baseDecimals: number of decimals used for the currency offered by 'user'
* baseSymbol: symbol of the currency offered by 'user'
* counterAmount: amount of tokens wanted for is offer
* counterDecimals: number of decimals used for the wanted currency
* counterSymbol: symbol of the wanted currency
* feesAmount: amount of fees (in GIZMO) the relayer is charging
* memo: a memo
* expires: Expiration date of the offer [should be in milliseconds since 1970, like Date.now()]

## Edit Order
```javascript
editOrder(wallet, user, key, baseAmount, baseDecimals, baseSymbol, counterAmount, counterDecimals, counterSymbol, expires)
```
This method allows to change an order. The only variables that can be changed are: the expiration date and the amounts offered and required by the order. It must be called with the authority of the user which created the order.

### Parameters:
* wallet: transit-eos wallet object which provide keys for the account performing the action (in this case: user)
* user: account of the user which created the order (authorization for this account must be provided in wallet)
* key: key identifying the order
* baseAmount: amount of tokens offered by 'user'
* baseDecimals: number of decimals used for the currency offered by 'user'
* baseSymbol: symbol of the currency offered by 'user'
* counterAmount: amount of tokens wanted for is offer
* counterDecimals: number of decimals used for the wanted currency
* counterSymbol: symbol of the wanted currency
* expires: Expiration date of the offer [should be in milliseconds since 1970, like Date.now()]

## Cancel Order
```javascript
cancelOrder(wallet, user, key)
```
This method allows to delete an existing order. Must be called by the owner of the order.

### Parameters:
* wallet: transit-eos wallet object which provide keys for the account performing the action (in this case: user)
* user: account of the user possessing the order (authorization for this account must be provided in wallet)
* key: key identifying the order

## Retire Order
```javascript
retireOrder(wallet, sender, key)
```
This method allows to delete an expired order. It can be called by anybody, a time check is done to prevent deletion of on expired orders.
This is used to do garbage collection.

### Parameters:
* wallet: transit-eos wallet object which provide keys for the account performing the action (in this case: sender)
* sender: account of the user possessing the order (authorization for this account must be provided in wallet)
* key: key identifying the order

## Settle Orders
```javascript
settleOrders(wallet, sender, makerKey, takerKey, makerBaseAmount, makerBaseDecimals, makerBaseSymbol, makerCounterAmount, makerCounterDecimals, makerCounterSymbol, takerBaseAmount, takerBaseDecimals, takerBaseSymbol, takerCounterAmount, takerCounterDecimals, takerCounterSymbol , memo)
```
This method allows to settle to matching orders. Can be called by anybody, checks are made to guarantee the matching.

### Parameters:
* wallet: transit-eos wallet object which provide keys for the account performing the action (in this case: sender)
* sender: account of the user issuing the settlement (authorization for this account must be provided in wallet)
* makerKey: Key index of the maker order
* takerKey: Key index of the taker order 
* makerBaseAmount: Amount payed by the maker to the taker (deduct this from the maker base amount)
* makerBaseDecimals: number of decimal of the currency offered by maker
* makerBaseSymbol: symbol of the currency offered by maker
* makerCounterAmount: Amount to deduct from the maker counter amount to keep asked price constant
* makerCounterDecimals: number of decimal of the currency asked by maker
* makerCounterSymbol: symbol of the currency asked by maker
* takerBaseAmount: Amount payed by the taker to the maker (deduct this from the taker base amount)
* takerBaseDecimals: number of decimal of the currency offered by taker
* takerBaseSymbol: symbol of the currency offered by taker
* takerCounterAmount: Amount to deduct from the taker counter amount to keep price constant
* takerCounterDecimals: number of decimal of the currency asked by taker
* takerCounterSymbol: symbol of the currency asked by taker
* memo: a memo

## Get Orders
```javascript
getOrders(params)
```
This method allows to query the full order list directly from the blockchain state.
Can be called by anybody as this information is public.
For convenience, we paginate the results (with the optional page and limit parameters). 

### Parameters (Optional):
The user can supply optional filters to refine the query.
* params.user: Filter the results to keep only the orders from user (OPTIONAL)
* params.sender: Filter the results to keep only the orders originating from sender (OPTIONAL)
* params.baseSymbol: Filter the results to keep only orders offering baseSymbol currency (OPTIONAL)
* params.counterSymbol: Filter the results to keep only orders asking for counterSymbol currency (OPTIONAL)
* params.page: Page number to return (OPTIONAL, requires params.limit)
* params.limit: Number of orders to include per page (OPTIONAL, requires params.page)

# Prerequisite
* node: install node from [here](https://nodejs.org/en/download/)

Prior to run, install all dependencies with `npm install`. To view dependencies, please refer to the package.json file.