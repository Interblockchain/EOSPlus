/* ==================================================
(c) 2019 Copyright Transledger inc. All rights reserved 
================================================== */

const BigNumber = require('bignumber.js');
const { UInt64 } = require('int64_t');
const axios = require('axios');

class transeos {
    constructor(params) {
        this.contractAddress = params.contractAddress;
        this.exchangeAddress = params.exchangeAddress;
        this.network = params.network;
    }

    /*=========================================================================================
      BASIC CONTRACT ACTIONS
      =========================================================================================
    */

    /*
    This method is used for creating new currencies with the Transledger Basic Contract.
    The arguments are:
        issuer: account which will be able to issue tokens of this currency and transfer initial amounts 
        max_supply: maximum supply which can be issued for this currency
        decimals: number of decimals to use for this currency,
        symbol: symbol used to identify this currency (ex: TBTC).
    NOTE: 
        Only works for Transledger, since we require the auth for the basicContract.
        Other users will not be able to access this!!!!
    Returns:
        result: the result from the blockchain for the action
    */
    async create(issuer, max_supply, decimals, symbol) {
        //Validation
        if (!issuer || typeof (issuer) != "string") { throw { name: "No issuer has been passed or it is not of type string", statusCode: "400", message: "Please provide an issuer for the currency." } }
        if (!max_supply) { throw { name: "No maximum supply has been passed", statusCode: "400", message: "Please provide a maximum supply for the currency." } }
        if (!decimals) { throw { name: "No decimals has been passed", statusCode: "400", message: "Please provide a number of decimal for this currency." } }
        if (!symbol || typeof (symbol) != "string") { throw { name: "No symbol has been passed or it is not of type string", statusCode: "400", message: "Please provide a token symbol." } }

        BigNumber.set({ DECIMAL_PLACES: decimals, ROUNDING_MODE: BigNumber.ROUND_DOWN });
        let value = new BigNumber(max_supply, 10);
        return {
            issuer: issuer,
            max_supply: `${value.toFixed(decimals)} ${symbol}`
        };
    }

    /*
    This method is used for actually issuing tokens up to max_supply
    The arguments are:
        wallet: transit-eos wallet object which provide keys for the account performing the action (in this case, the issuer of the currency)
        to: account which will receive the issued tokens
        quantity: amount of tokens issued
        decimals: number of decimals used for the currency
        symbol: symbol of the currency
        memo: a memo
    Returns:
        result: the result from the blockchain for the action
    */
    async issue(to, quantity, decimals, symbol, memo) {
        //Validation
        if (!to || typeof (to) != "string") { throw { name: "No destination has been passed or it is not of type string", statusCode: "400", message: "Please provide a destination (to) for the issuance." } }
        if (!quantity) { throw { name: "No quantity has been passed", statusCode: "400", message: "Please provide a quantity for the issuance." } }
        if (!decimals) { throw { name: "No decimals has been passed", statusCode: "400", message: "Please provide a number of decimal for this currency." } }
        if (!symbol || typeof (symbol) != "string") { throw { name: "No symbol has been passed or it is not of type string", statusCode: "400", message: "Please provide a token symbol." } }

        let _memo = (memo) ? memo : `Issue ${symbol}`;
        BigNumber.set({ DECIMAL_PLACES: decimals, ROUNDING_MODE: BigNumber.ROUND_DOWN });
        let value = new BigNumber(quantity, 10);
        return {
            to: to,
            quantity: `${value.toFixed(decimals)} ${symbol}`,
            memo: _memo
        };
    }

    /*
    This method is used for transferring tokens between two accounts, using the authority of the 'from' account.
    The arguments are:
        wallet: transit-eos wallet object which provide keys for the account performing the action
        from: account sending the funds (authorization for this account must be provided in wallet)
        to: account which will receive the tokens
        quantity: amount of tokens transferred
        decimals: number of decimals used for the currency
        symbol: symbol of the currency
        memo: a memo
    Returns:
        result: the result from the blockchain for the action
    */
    async transfer(from, to, quantity, decimals, symbol, memo) {
        //Validation
        if (!from || typeof (from) != "string") { throw { name: "No source account has been passed or it is not of type string", statusCode: "400", message: "Please provide a source (from) for the transaction." } }
        if (!to || typeof (to) != "string") { throw { name: "No destination has been passed or it is not of type string", statusCode: "400", message: "Please provide a destination (to) for the transaction." } }
        if (!quantity) { throw { name: "No quantity has been passed", statusCode: "400", message: "Please provide a quantity for the transaction." } }
        if (!decimals) { throw { name: "No decimals has been passed", statusCode: "400", message: "Please provide a number of decimal for this currency." } }
        if (!symbol || typeof (symbol) != "string") { throw { name: "No symbol has been passed or it is not of type string", statusCode: "400", message: "Please provide a token symbol." } }

        let _memo = (memo) ? memo : `Issue ${symbol}`;
        BigNumber.set({ DECIMAL_PLACES: decimals, ROUNDING_MODE: BigNumber.ROUND_DOWN });
        let value = new BigNumber(quantity, 10);
        return {
            from: from,
            to: to,
            quantity: `${value.toFixed(decimals)} ${symbol}`,
            memo: _memo
        };
    }

    /*
    This method is used for transferring tokens between two accounts, using the authority of the 'spender' account.
    In order to do so, the 'from' account must have approved 'spender' before hand.
    The arguments are:
        wallet: transit-eos wallet object which provide keys for the action
        from: account sending the funds
        to: account which will receive the tokens
        spender: account which has authority to make the transfer (authorization for this account must be provided in wallet)
        quantity: amount of tokens transferred
        decimals: number of decimals used for the currency
        symbol: symbol of the currency
        memo: a memo
    Returns:
        result: the result from the blockchain for the action
    */
    async transferfrom(from, to, spender, quantity, decimals, symbol, memo) {
        //Validation
        if (!from || typeof (from) != "string") { throw { name: "No source account has been passed or it is not of type string", statusCode: "400", message: "Please provide a source (from) for the transaction." } }
        if (!to || typeof (to) != "string") { throw { name: "No destination has been passed or it is not of type string", statusCode: "400", message: "Please provide a destination (to) for the transaction." } }
        if (!spender || typeof (spender) != "string") { throw { name: "No spender has been passed or it is not of type string", statusCode: "400", message: "Please provide a spender for the transaction." } }
        if (!quantity) { throw { name: "No quantity has been passed", statusCode: "400", message: "Please provide a quantity for the transaction." } }
        if (!decimals) { throw { name: "No decimals has been passed", statusCode: "400", message: "Please provide a number of decimal for this currency." } }
        if (!symbol || typeof (symbol) != "string") { throw { name: "No symbol has been passed or it is not of type string", statusCode: "400", message: "Please provide a token symbol." } }

        let _memo = (memo) ? memo : `Issue ${symbol}`;
        BigNumber.set({ DECIMAL_PLACES: decimals, ROUNDING_MODE: BigNumber.ROUND_DOWN });
        let value = new BigNumber(quantity, 10);
        return {
            from: from,
            to: to,
            spender: spender,
            quantity: `${value.toFixed(decimals)} ${symbol}`,
            memo: _memo
        };
    }

    /*
    This method is used for pre-approving a 'spender' account, allowing them to spend a fix quantity of tokens on your behalf.
    The arguments are:
        wallet: transit-eos wallet object which provide keys for the action
        owner: account possessing the tokens (authorization for this account must be provided in wallet)
        spender: account to give authority to 
        quantity: amount of tokens 'spender' can transfer
        decimals: number of decimals used for the currency
        symbol: symbol of the currency
    Returns:
        result: the result from the blockchain for the action
    */
    async approve(owner, spender, quantity, decimals, symbol) {
        //Validation
        if (!wallet) { throw { name: "No wallet has been passed", statusCode: "400", message: "Please provide an authenticated wallet." } }
        if (!wallet.auth) { throw { name: "No auth information has been passed with wallet", statusCode: "400", message: "Please provide an authenticated wallet." } }
        if (!owner || typeof (owner) != "string") { throw { name: "No owner has been passed or it is not of type string", statusCode: "400", message: "Please provide an owner for the approval." } }
        if (!spender || typeof (spender) != "string") { throw { name: "No spender has been passed or it is not of type string", statusCode: "400", message: "Please provide a spender for the approval." } }
        if (!quantity) { throw { name: "No quantity has been passed", statusCode: "400", message: "Please provide a quantity for the approval." } }
        if (!decimals) { throw { name: "No decimals has been passed", statusCode: "400", message: "Please provide a number of decimal for this currency." } }
        if (!symbol || typeof (symbol) != "string") { throw { name: "No symbol has been passed or it is not of type string", statusCode: "400", message: "Please provide a token symbol." } }

        BigNumber.set({ DECIMAL_PLACES: decimals, ROUNDING_MODE: BigNumber.ROUND_DOWN });
        let value = new BigNumber(quantity, 10);
        return {
            owner: owner,
            spender: spender,
            quantity: `${value.toString()} ${symbol}`
        };
    }

    /*
    This method allows to check the balance of an account for a currency.
    The arguments are:
        account: account possessing the tokens
        symbol:  symbol of the currency (optional)
    Returns:
        balances: array of strings containing the relevant balances
    */
    async getBalance(account, symbol, page, limit) {
        if (!account) { throw { name: "Missing arguments", statusCode: "400", message: 'Account name is not provided!' } }
        try {
            let result = await axios({
                method: 'POST',
                url: (this.network.port) ? `${this.network.protocol}://${this.network.host}:${this.network.port}/v1/chain/get_currency_balance` : `${this.network.protocol}://${this.network.host}/v1/chain/get_currency_balance`,
                headers: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: {
                    code: this.contractAddress,
                    account: account,
                    symbol: symbol
                }
            });
            let balances = result.data;
            if (symbol && Array.isArray(balances)) balances = balances.filter(element => element.split(" ")[1] == symbol);
            let total = balances.length;
            if (page && limit && Array.isArray(balances)) balances = this.paginateArray(balances, page, limit);
            return {
                docs: balances,
                total: total,
                limit: (limit) ? parseInt(limit) : total,
                page: (page) ? parseInt(page) : 1,
                pages: (limit) ? Math.ceil(total / parseInt(limit)) : 1
            };
        } catch (error) {
            throw { name: error.name, statusCode: "500", message: error.message }
        }
    }

    /*
    This method allows to check the allowance table of an account.
    The arguments are:
        account: account possessing the table
        spender: account which has permission to spend (optional)
        symbol: symbol of the currency (optional) 
    Returns:
        rows: array of objects containing the relevant permissions
    */
    async getAllowance(account, spender, symbol, page, limit) {
        if (!account) { throw { name: "Missing arguments", statusCode: "400", message: 'Account name is not provided!' } }
        try {
            let result = await axios({
                method: 'POST',
                url: (this.network.port) ? `${this.network.protocol}://${this.network.host}:${this.network.port}/v1/chain/get_table_rows` : `${this.network.protocol}://${this.network.host}/v1/chain/get_table_rows`,
                headers: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: {
                    code: this.contractAddress,
                    scope: account,
                    table: "allowed",
                    json: true
                }
            });
            let rows = result.data.rows;
            if (spender && Array.isArray(rows)) rows = rows.filter(element => element.spender == spender);
            if (symbol && Array.isArray(rows)) rows = rows.filter(element => element.quantity.split(" ")[1] == symbol);
            let total = rows.length;
            if (page && limit && Array.isArray(rows)) rows = this.paginateArray(rows, page, limit);
            return {
                docs: rows,
                total: total,
                limit: (limit) ? parseInt(limit) : total,
                page: (page) ? parseInt(page) : 1,
                pages: (limit) ? Math.ceil(total / parseInt(limit)) : 1
            };
        } catch (error) {
            throw { name: error.name, statusCode: "500", message: error.message }
        }
    }

    /*=========================================================================================
      EXCHANGE CONTRACT ACTIONS
      =========================================================================================
    */

    /*
    This method creates an order in the specified network.
    The arguments are:
        wallet: transit-eos wallet object which provide keys for the action
        user: account of the user, possessing the tokens, that will be used in the order (authorization for this account must be provided in wallet)
        sender: account of the relayer (exchange) which will get the commission (fees) for this order 
        baseAmount: amount of tokens offered by 'user'
        baseDecimals: number of decimals used for the currency offered by 'user'
        baseSymbol: symbol of the currency offered by 'user'
        counterAmount: amount of tokens wanted for is offer
        counterDecimals: number of decimals used for the wanted currency
        counterSymbol: symbol of the wanted currency
        feesAmount: amount of fees (in GIZMO) the relayer is charging
        memo: a memo
        expires: Expiration date of the offer [should be in milliseconds since 1970, like Date.now()]
    Returns:
        result: the result from the blockchain for the action
    */
    async createOrder(user, sender, baseAmount, baseDecimals, baseSymbol, counterAmount, counterDecimals, counterSymbol, feesAmount, memo, expires) {
        //Validation
        if (!user || typeof (user) != "string") { throw { name: "No user has been passed or it is not of type string", statusCode: "400", message: "Please provide a user for the order." } }
        if (!sender || typeof (sender) != "string") { throw { name: "No sender has been passed or it is not of type string", statusCode: "400", message: "Please provide a sender for the order." } }
        if (!baseAmount) { throw { name: "No offer quantity has been passed", statusCode: "400", message: "Please provide an offer quantity for the order." } }
        if (!baseDecimals) { throw { name: "No offer decimals has been passed", statusCode: "400", message: "Please provide a number of decimal for this currency." } }
        if (!baseSymbol || typeof (baseSymbol) != "string") { throw { name: "No offer symbol has been passed or it is not of type string", statusCode: "400", message: "Please provide a token symbol for the offer." } }
        if (!counterAmount) { throw { name: "No counter quantity has been passed", statusCode: "400", message: "Please provide a quantity for the order." } }
        if (!counterDecimals) { throw { name: "No counter decimals has been passed", statusCode: "400", message: "Please provide a number of counter decimal for this currency." } }
        if (!counterSymbol || typeof (counterSymbol) != "string") { throw { name: "No counter symbol has been passed or it is not of type string", statusCode: "400", message: "Please provide a token symbol for the counter." } }
        if (!expires) { throw { name: "No expire date has been passed", statusCode: "400", message: "Please provide an expire date (in miliseconds like Date.now()) for the order." } }

        let timestamp = Date.now();
        let key = this.getKeyForOrder(user, baseSymbol, timestamp);
        let _memo = (memo) ? memo : `Issue order ${key}`;

        BigNumber.set({ DECIMAL_PLACES: baseDecimals, ROUNDING_MODE: BigNumber.ROUND_DOWN });
        let base = new BigNumber(baseAmount, 10);
        let baseStr = base.toString();
        BigNumber.set({ DECIMAL_PLACES: counterDecimals, ROUNDING_MODE: BigNumber.ROUND_DOWN });
        let counter = new BigNumber(counterAmount, 10);
        let counterStr = counter.toString();
        BigNumber.set({ DECIMAL_PLACES: 8, ROUNDING_MODE: BigNumber.ROUND_DOWN });  //HERE CHECK NUMBER OF DECIMALS
        let fees = new BigNumber(feesAmount, 10);
        let feesStr = fees.toString();
        return {
            user: user,
            sender: sender,
            key: key,
            base: `${baseStr} ${baseSymbol}`,
            counter: `${counterStr} ${counterSymbol}`,
            fees: `${feesStr} GIZMO`,   //HERE CHECK TOKEN Symbol
            memo: _memo,
            timestamp: timestamp,
            expires: expires
        };
    }

    /*
     This method allows to change an offer. The only variables that can be changed are: the expiration date and the amounts offered and required by the order. 
     The arguments are:
        wallet: transit-eos wallet object which provide keys for the action
        user: account of the user, possessing the tokens, that will be used in the order (authorization for this account must be provided in wallet)
        key: key identifying the order
        baseAmount: amount of tokens offered by 'user'
        baseDecimals: number of decimals used for the currency offered by 'user'
        baseSymbol: symbol of the currency offered by 'user'
        counterAmount: amount of tokens wanted for is offer
        counterDecimals: number of decimals used for the wanted currency
        counterSymbol: symbol of the wanted currency
        expires: Expiration date of the offer [should be in milliseconds since 1970, like Date.now()]
     Returns:
         result: the result from the blockchain for the action
     */
    async editOrder(user, key, baseAmount, baseDecimals, baseSymbol, counterAmount, counterDecimals, counterSymbol, expires) {
        //Validation
        if (!user || typeof (user) != "string") { throw { name: "No user has been passed or it is not of type string", statusCode: "400", message: "Please provide a user for the order." } }
        if (!key) { throw { name: "No key has been passed", statusCode: "400", message: "Please provide a key identifying the order to modify." } }
        if (!baseAmount) { throw { name: "No offer quantity has been passed", statusCode: "400", message: "Please provide an offer quantity for the order." } }
        if (!baseDecimals) { throw { name: "No offer decimals has been passed", statusCode: "400", message: "Please provide a number of decimal for this currency." } }
        if (!baseSymbol || typeof (baseSymbol) != "string") { throw { name: "No offer symbol has been passed or it is not of type string", statusCode: "400", message: "Please provide a token symbol for the offer." } }
        if (!counterAmount) { throw { name: "No counter quantity has been passed", statusCode: "400", message: "Please provide a quantity for the order." } }
        if (!counterDecimals) { throw { name: "No counter decimals has been passed", statusCode: "400", message: "Please provide a number of counter decimal for this currency." } }
        if (!counterSymbol || typeof (counterSymbol) != "string") { throw { name: "No counter symbol has been passed or it is not of type string", statusCode: "400", message: "Please provide a token symbol for the counter." } }
        if (!expires) { throw { name: "No expire date has been passed", statusCode: "400", message: "Please provide an expire date (in miliseconds like Date.now()) for the order." } }

        BigNumber.set({ DECIMAL_PLACES: baseDecimals, ROUNDING_MODE: BigNumber.ROUND_DOWN });
        let base = new BigNumber(baseAmount, 10);
        let baseStr = base.toString();
        BigNumber.set({ DECIMAL_PLACES: counterDecimals, ROUNDING_MODE: BigNumber.ROUND_DOWN });
        let counter = new BigNumber(counterAmount, 10);
        let counterStr = counter.toString();
        return {
            key: key,
            base: `${baseStr} ${baseSymbol}`,
            counter: `${counterStr} ${counterSymbol}`,
            expires: expires
        };
    }

    /*
     This method allows to delete an existing order.
     Must be called by the owner of the order.
     The arguments are:
        wallet: transit-eos wallet object which provide keys for the action
        user: account of the user possessing the order (authorization for this account must be provided in wallet)
        key: key identifying the order
     Returns:
         result: the result from the blockchain for the action
     */
    async cancelOrder(user, key) {
        //Validation
        if (!user || typeof (user) != "string") { throw { name: "No user has been passed or it is not of type string", statusCode: "400", message: "Please provide a user for the order." } }
        if (!key) { throw { name: "No key has been passed", statusCode: "400", message: "Please provide a key identifying the order to delete." } }
        return {
            key: key
        };
    }

    /*
         This method allows to delete an existing order when the expiration is reached.
         Can be called by anybody on an expired order (used for garbage collection).
         The arguments are:
            wallet: transit-eos wallet object which provide keys for the action
            sender: account of the sender retiring the order (authorization for this account must be provided in wallet)
            key: key identifying the order
         Returns:
             result: the result from the blockchain for the action
         */
    async retireOrder(sender, key) {
        //Validation
        if (!sender || typeof (sender) != "string") { throw { name: "No sender has been passed or it is not of type string", statusCode: "400", message: "Please provide a sender for the order." } }
        if (!key) { throw { name: "No key has been passed", statusCode: "400", message: "Please provide a key identifying the order to retire." } }
        return  {
            key: key
        };
    }

    /*
     This method allows to settle to matching orders.
     Can be called by anybody, checks are made to guarantee the matching.
     The arguments are:
        wallet: transit-eos wallet object which provide keys for the action
        sender: account of the user issuing the settlement (authorization for this account must be provided in wallet)
        makerKey: Key index of the maker order
        takerKey: Key index of the taker order 
        makerBaseAmount: Amount payed by the maker to the taker (deduct this from the maker base amount)
        makerBaseDecimals: number of decimal of the currency offered by maker
        makerBaseSymbol: symbol of the currency offered by maker
        makerCounterAmount: Amount to deduct from the maker counter amount to keep asked price constant
        makerCounterDecimals: number of decimal of the currency asked by maker
        makerCounterSymbol: symbol of the currency asked by maker
        takerBaseAmount: Amount payed by the taker to the maker (deduct this from the taker base amount)
        takerBaseDecimals: number of decimal of the currency offered by taker
        takerBaseSymbol: symbol of the currency offered by taker
        takerCounterAmount: Amount to deduct from the taker counter amount to keep price constant
        takerCounterDecimals: number of decimal of the currency asked by taker
        takerCounterSymbol: symbol of the currency asked by taker
        memo: a memo
     Returns:
         rows: the result from the blockchain for the action
     */
    async settleOrders(sender, makerKey, takerKey, makerBaseAmount, makerBaseDecimals, makerBaseSymbol, makerCounterAmount, makerCounterDecimals, makerCounterSymbol, takerBaseAmount, takerBaseDecimals, takerBaseSymbol, takerCounterAmount, takerCounterDecimals, takerCounterSymbol, memo) {
        //Validation
        if (!sender || typeof (sender) != "string") { throw { name: "No sender has been passed or it is not of type string", statusCode: "400", message: "Please provide a sender for the action." } }
        if (!makerKey) { throw { name: "No maker key has been passed", statusCode: "400", message: "Please provide a maker key identifying the order to settle." } }
        if (!takerKey) { throw { name: "No taker key has been passed", statusCode: "400", message: "Please provide a taker key identifying the order to settle." } }
        if (!makerBaseAmount) { throw { name: "No  maker offer quantity has been passed", statusCode: "400", message: "Please provide a maker offer quantity." } }
        if (!makerBaseDecimals) { throw { name: "No maker offer decimals has been passed", statusCode: "400", message: "Please provide a number of decimal for this currency." } }
        if (!makerBaseSymbol || typeof (makerBaseSymbol) != "string") { throw { name: "No  maker offer symbol has been passed or it is not of type string", statusCode: "400", message: "Please provide a token symbol for the maker offer." } }
        if (!makerCounterAmount) { throw { name: "No maker counter quantity has been passed", statusCode: "400", message: "Please provide maker counter quantity." } }
        if (!makerCounterDecimals) { throw { name: "No maker counter decimals has been passed", statusCode: "400", message: "Please provide a number of maker counter decimal for this currency." } }
        if (!makerCounterSymbol || typeof (makerCounterSymbol) != "string") { throw { name: "No maker counter symbol has been passed or it is not of type string", statusCode: "400", message: "Please provide a token symbol for the maker counter." } }
        if (!takerBaseAmount) { throw { name: "No taker offer quantity has been passed", statusCode: "400", message: "Please provide a taker offer quantity." } }
        if (!takerBaseDecimals) { throw { name: "No taker offer decimals has been passed", statusCode: "400", message: "Please provide a number of decimal for this currency." } }
        if (!takerBaseSymbol || typeof (takerBaseSymbol) != "string") { throw { name: "No taker offer symbol has been passed or it is not of type string", statusCode: "400", message: "Please provide a token symbol for the taker offer." } }
        if (!takerCounterAmount) { throw { name: "No taker counter quantity has been passed", statusCode: "400", message: "Please provide a taker counter quantity." } }
        if (!takerCounterDecimals) { throw { name: "No taker counter decimals has been passed", statusCode: "400", message: "Please provide a number of taker counter decimal for this currency." } }
        if (!takerCounterSymbol || typeof (takerCounterSymbol) != "string") { throw { name: "No taker counter symbol has been passed or it is not of type string", statusCode: "400", message: "Please provide a token symbol for the taker counter." } }

        // Amount to deduct from the maker amounts
        BigNumber.set({ DECIMAL_PLACES: makerBaseDecimals, ROUNDING_MODE: BigNumber.ROUND_DOWN });
        base = new BigNumber(makerBaseAmount, 10);
        let makerBaseStr = base.toString();
        BigNumber.set({ DECIMAL_PLACES: makerCounterDecimals, ROUNDING_MODE: BigNumber.ROUND_DOWN });
        let counter = new BigNumber(makerCounterAmount, 10);
        let makerCounterStr = counter.toString();
        // Amount to deduct from the taker amounts
        BigNumber.set({ DECIMAL_PLACES: takerBaseDecimals, ROUNDING_MODE: BigNumber.ROUND_DOWN });
        base = new BigNumber(takerBaseAmount, 10);
        let takerBaseStr = base.toString();
        BigNumber.set({ DECIMAL_PLACES: takerCounterDecimals, ROUNDING_MODE: BigNumber.ROUND_DOWN });
        counter = new BigNumber(takerCounterAmount, 10);
        let takerCounterStr = counter.toString();
        return  {
            maker: makerKey,                                              // Key of the maker order
            taker: takerKey,                                              // Key of the taker order
            quantity_maker: makerBaseStr + " " + makerBaseSymbol,         // Quantity payed by the maker
            deduct_maker: makerCounterStr + " " + makerCounterSymbol,     // Quantity to deduct from maker.counter
            quantity_taker: takerBaseStr + " " + takerBaseSymbol,         // Quantity payed by the taker
            deduct_taker: takerCounterStr + " " + takerCounterSymbol,     // Quantity to deduct from taker.counter
            memo: memo
        };
    }

    /*
     This method allows to query the full order list directly from the blockchain state.
     Can be called by anybody as this information is public.
     The arguments are optional and contained in an object:
        params.user: Filter the results to keep only the orders from user (OPTIONAL)
        params.sender: Filter the results to keep only the orders originating from sender (OPTIONAL)
        params.baseSymbol: Filter the results to keep only orders offering baseSymbol currency (OPTIONAL)
        params.counterSymbol: Filter the results to keep only orders asking for counterSymbol currency (OPTIONAL)
     Returns:
         result: the paginated list of orders on the blockchain
*/
    async getOrders(params) {
        try {
            let result = await axios({
                method: 'POST',
                url: (this.network.port) ? `${this.network.protocol}://${this.network.host}:${this.network.port}/v1/chain/get_table_rows` : `${this.network.protocol}://${this.network.host}/v1/chain/get_table_rows`,
                headers: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: {
                    code: this.exchangeAddress,
                    scope: this.exchangeAddress,
                    table: "orders",
                    json: true
                }
            });
            let rows = result.data.rows;

            if (params && params.user && Array.isArray(rows)) rows = rows.filter(element => element.user == params.user);
            if (params && params.sender && Array.isArray(rows)) rows = rows.filter(element => element.sender == params.sender);
            if (params && params.baseSymbol && Array.isArray(rows)) rows = rows.filter(element => element.base.split(" ")[1] == params.baseSymbol);
            if (params && params.counterSymbol && Array.isArray(rows)) rows = rows.filter(element => element.counter.split(" ")[1] == params.counterSymbol);
            let total = rows.length;
            if (params && params.page && params.limit && Array.isArray(rows)) rows = this.paginateArray(rows, page, limit);

            return {
                docs: rows,
                total: total,
                limit: (params.limit) ? parseInt(params.limit) : total,
                page: (params.page) ? parseInt(params.page) : 1,
                pages: (params.limit) ? Math.ceil(total / parseInt(params.limit)) : 1
            };
        } catch (error) {
            throw { name: error.name, statusCode: "500", message: error.message }
        }
    }

    /*=========================================================================================
     PRIVATE METHODS
     =========================================================================================*/
    charToValue(c) {
        let value = c.charCodeAt(0);
        //console.log(c + "  " + c.charCodeAt(0));
        if (value == 46) { return 0; }
        else if (value >= 49 && value <= 53) { return value - 48; }
        else if (value >= 97 && value <= 122) { return value - 91; }
        else {
            throw { message: "character is not allowed in character set for names" };
        }
    }

    strToName(str) {
        let value = new UInt64(0x0);
        if (str.length > 13) {
            throw { message: "string is too long to be a valid name" };
        }
        if (str.length == 0) {
            return;
        }
        let n = Math.min(str.length, 12);
        for (var i = 0; i < n; ++i) {
            value = value.shiftLeft(5);
            value = value.or(new UInt64(this.charToValue(str.charAt(i))));
        }
        value = value.shiftLeft(4 + 5 * (12 - n));
        if (str.length == 13) {
            let v = this.charToValue(str.charAt(12));
            if (v > 15) {
                throw { message: "thirteenth character in name cannot be a letter that comes after j" };
            }
            value = value.or(new UInt64(v));
        }
        return value;
    }

    strToSymbol(str) {
        if (str.length > 7) {
            throw { message: "string is too long to be a valid symbol_code" };
        }
        let value = new UInt64(0x0);
        for (let i = str.length - 1; i >= 0; i--) {
            let cv = str.charCodeAt(i);
            if (cv < 65 || cv > 90) { throw { message: "only uppercase letters allowed in symbol_code string" } }
            value = value.shiftLeft(8);
            value = value.or(new UInt64(cv));
        }
        return value;
    }

    getKeyForOrder(user, baseSymbol, timestamp) {
        let account = this.strToName(user);
        // console.log("account: " + account.toString());
        let asset = this.strToSymbol(baseSymbol);
        // console.log("asset: " + asset.toString());
        let time = new UInt64(Number(timestamp));
        // console.log("time: " + time.toString());
        return account.add(asset).add(time).toString();
    }

    paginateArray(array, page_number, page_size) {
        --page_number; // because pages logically start with 1, but technically with 0
        return array.slice(page_number * page_size, (page_number + 1) * page_size);
    }

}

module.exports = transeos;