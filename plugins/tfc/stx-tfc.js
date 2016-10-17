/**
* Account object used by {@link STX.TFC}. 
* Derive an account object from this basic template and
* ensure that each of the functions works correctly and that the data
* is stored in the specified format.
*	
* See {@tutorial Trade From Chart introduction} for implementation details.
*
* @constructor
* @abstract
* @example
* // Required data format for the TFC Account object.
 	this.currency="USD";
	this.balances={
		liquidity: 100000,
		unsettledCash: 0,
		cash: 100000,
		profitLoss: 0,
		buyingPower: 200000
	};
	this.positions={
		"IBM":{quantity:1000,basis:126.13, price:129.13, prevClose:123.13, currency:"USD"},
		"GE":{quantity:100,basis:26.11, price:24.11, prevClose:26.11, currency:"USD"},
		"SPY":{quantity:-1000,basis:187.11, price:187.11, prevClose:190.11, currency:"USD"},
		"LNKD":{quantity:-100,basis:230, price:186, prevClose:240, currency:"USD"}
	};
	this.trades={
		"IBM":
			[
				{id:"IBM001", time:1366206180000, quantity:300, basis:124.13, price:129.13, currency:"USD", protect:{limit:165, stop:135}},
				{id:"IBM002", time:1366910520000, quantity:600, basis:127.13, price:129.13, currency:"USD"},
				{id:"IBM003", time:1407181680000, quantity:100, basis:126.13, price:129.13, currency:"USD"}
			],
		"GE":
			[
				{id:"GE001", time:1433779740000, quantity:100, basis:26.11, price:24.11, currency:"USD", protect:{limit:30, stop:25}}
			],
		"SPY":
			[
				{id:"SPY001", time:1419262080000, quantity:-700, basis:190.45, price:187.11, currency:"USD"},
				{id:"SPY002", time:1419262380000, quantity:-300, basis:179.32, price:187.11, currency:"USD"}
			],
		"LNKD":
			[
				{id:"LNKD001", time:1420740540000, quantity:-100, basis:230, price:186, currency:"USD"}
			]
	};
	this.openOrders={
		"IBM":
			[	
				{id:"1", action:"sell", quantity:500, limit:197, tif:"GTC", currency:"USD"},
				{id:"2", action:"sell", quantity:500, limit:196, tif:"GTC", currency:"USD"},
				{id:"9", tradeid:"IBM001", action:"sell", quantity:300, limit:165, tif:"GTC", currency:"USD", oco:"10"},
				{id:"10", tradeid:"IBM001", action:"sell", quantity:300, stop:135, tif:"GTC", currency:"USD", oco:"9"}
			],
		"TSLA":
			[
				{id:"3", action:"buy", quantity:10, limit:170, tif:"DAY", currency:"USD"}
			],
		"GE":
			[
				{id:"4", tradeid:"GE001", action:"sell", quantity:100, limit:30, tif:"GTC", currency:"USD", oco:"5"},
				{id:"5", tradeid:"GE001", action:"sell", quantity:100, stop:25, tif:"GTC", currency:"USD", oco:"4"}
			],
		"LNKD":
			[
		        {id:"6", action:"buy", quantity:100, limit:112, tif:"DAY", currency:"USD", oto: 
		        	[
						{id:"7", action:"sell", quantity:100, limit:130, tif:"GTC", currency:"USD", oco:"8"},
						{id:"8", action:"sell", quantity:100, stop:110, tif:"GTC", currency:"USD", oco:"7"}
					]
		        },
				{id:"9", action:"buy", quantity:100, limit:112, tif:"DAY", currency:"USD", oto: 
					[
					 {id:"10", action:"sell", quantity:100, limit:130, tif:"GTC", currency:"USD", oco:true}		// if only one leg, set oco to true.
					]
		        },				
			]
	};
	this.config={
		oto:true,
		oco:true,
		closeAll:true, // Set to true to enable close all capability
		disableModifyOrderQuantity:false,
		gtcOnly:false,
		tradeActions:true // set to true to enable to protection/actions tab in the enhanced view
		reducePosition:true,
		hedging:false,
		vsp:""
	};
*/

STX.Account=function(){
	this.balances={};
	this.openOrders={};
	this.positions={};
	this.trades={}; // "trades" from Forex systems. If this exists then the "lots" view will be enabled.
};
/**
 * Config object required by Account.Config
 * @param {boolean} [config.gtcOnly] Set to true if no DAY TIF supported
 * @param {boolean} [config.oco] Set to true if oco orders are supported
 * @param {boolean} [config.oto] Set to true if oto orders are supported
 * @param {boolean} [config.closeAll] Set to true to allow closing all positions
 * @param {boolean} [config.disableModifyOrderQuantity] Set to true if order modify does not support quantity change
 * @param {boolean} [config.tradeActions] Set to true to allow actions on the trades (lots) such as protect and close
 * @param {boolean} [config.reducePositions] Set to false to disallow actions which reduce positions (such as the sell/cover order form)
 * @param {boolean} [config.hedging] Set to true to allow hedging actions (stepping into a long and short position in the same security)
 * @param {string}  [config.vsp] *PROPOSED* Set to a combination of M/L/S to allow vsp orders (reducing trades) of market, limit and stop order type, respectively
 * @param {boolean} [config.showOpenOrdersWhenTFCClosed] Set to true if you want open orders markers to display when the TFC side bar is closed
*/

/**
 * Balances object required by Account.Balances
 * @callback STX.Account.Balances
 * @param {object} balances A balances object
 * @param {number} balances.liquidity The liquidation value for the account
 * @param {number} balances.cash Trading cash in the account
 * @param {number} balances.profitLoss Gain or loss in the account
 * @param {number} balances.unsettledCash Unsettled cash for the account
 * @param {number} balances.buyingPower Buying power for the account. Null if not a margin account.
 * @example
 * this.balances={
		liquidity: 100000,
		unsettledCash: 0,
		cash: 100000,
		profitLoss: 0,
		buyingPower: 200000
	}; */

/**
 * Function used for fetching balances. Your implementation should set `this.balances`.
 * The server fetch callback function should return data in {@link STX.Account.Balances} format, or you must format it once received.
 * @param  {funcion} cb Required Callback function to track data fetch progress. Do not remove.
 */
STX.Account.prototype.fetchBalances=function(cb){
	cb();
};

/**
 * Positions object required by Account.Positions
 * @callback STX.Account.Positions
 * @param {object} positions A positions object. Contains a field for each security symbol.
 * @example
 * 	this.positions={
		"IBM":{quantity:1000,basis:126.13, price:129.13, prevClose:123.13, currency:"USD"}, // "basis" is the (current, cumulative) cost-basis for the position
		"GE":{quantity:100,basis:26.11, price:24.11, prevClose:26.11, currency:"USD"},
		"SPY":{quantity:-1000,basis:187.11, price:187.11, prevClose:190.11, currency:"USD"}, // Use negative values for short positions
		"LNKD":{quantity:-100,basis:230, price:186, prevClose:240, currency:"USD"}
	};
 */

/**
 * Function used for fetching Positions. Your implementation should `set this.positions`.
 * The server fetch callback function should return data in {@link STX.Account.Positions} format, or you must format it once received
 * @param  {funcion} cb Required Callback function to track data fetch progress. Do not remove.
 */
STX.Account.prototype.fetchPositions=function(cb){
	cb();
};

/**
 * OpenOrders STX.Account.OpenOrders
 * @callback STX.Account.OpenOrders
 * @param {object} openOrders An open orders object. Contains a field for each security symbol. Each symbol contains an array
 * of open orders. It is assumed that each open order is referenced by a unique id. An optional "oco" field should reference the id
 * of a linked order. An optional "oto" field contains an array of orders that will be triggered on execution.
 * @example
	this.openOrders={
		"IBM":
			[	
				{id:"1", action:"sell", quantity:500, limit:197, tif:"GTC", currency:"USD"},
				{id:"2", action:"sell", quantity:500, limit:196, tif:"GTC", currency:"USD"},
				{id:"9", tradeid:"IBM001", action:"sell", quantity:300, limit:165, tif:"GTC", currency:"USD", oco:"10"},
				{id:"10", tradeid:"IBM001", action:"sell", quantity:300, stop:135, tif:"GTC", currency:"USD", oco:"9"}
			],
		"TSLA":
			[
				{id:"3", action:"buy", quantity:10, limit:170, tif:"DAY", currency:"USD"}
			],
		"GE":
			[
				{id:"4", tradeid:"GE001", action:"sell", quantity:100, limit:30, tif:"GTC", currency:"USD", oco:"5"},
				{id:"5", tradeid:"GE001", action:"sell", quantity:100, stop:25, tif:"GTC", currency:"USD", oco:"4"}
			],
		"LNKD":
			[
		        {id:"6", action:"buy", quantity:100, limit:112, tif:"DAY", currency:"USD", oto: 
		        	[
						{id:"7", action:"sell", quantity:100, limit:130, tif:"GTC", currency:"USD", oco:"8"},
						{id:"8", action:"sell", quantity:100, stop:110, tif:"GTC", currency:"USD", oco:"7"}
					]
		        },
				{id:"9", action:"buy", quantity:100, limit:112, tif:"DAY", currency:"USD", oto: 
					[
					 {id:"10", action:"sell", quantity:100, limit:130, tif:"GTC", currency:"USD", oco:true}		// if only one leg, set oco to true.
					]
		        },				
			]
	};
 */

/**
 * Function used for  fetching Open Orders. Your implementation should set `this.openOrders`.
 * The server fetch callback function should return data in {@link STX.Account.OpenOrders} format, or you must format it once received.
 * @param  {funcion} cb Required Callback function to track data fetch progress. Do not remove.
 */
STX.Account.prototype.fetchOpenOrders=function(cb){
	cb();
};

/**
 * Trades object required by Account.Trades
 * @callback STX.Account.Trades
 * @param {object} trades A trades object. Contains a field for each security symbol. Each symbol contains an array
 * of trades. It is assumed that each trade is referenced by a unique id. An optional "protect" field should reference the ids
 * of a linked take profit and/or stop loss order.
 * @example
 * this.trades={
		"IBM":
			[
				{id:"IBM001", time:1366206180000, quantity:300, basis:124.13, price:129.13, currency:"USD", protect:{limit:165, stop:135}},
		       {id:"IBM002", time:1366910520000, quantity:600, basis:127.13, price:129.13, currency:"USD"},
		       {id:"IBM003", time:1407181680000, quantity:100, basis:126.13, price:129.13, currency:"USD"}
			],
		"GE":
			[
				{id:"GE001", time:1433779740000, quantity:100, basis:26.11, price:24.11, currency:"USD", protect:{limit:30, stop:25}}
			],
		"SPY":
			[
				{id:"SPY001", time:1419262080000, quantity:-700, basis:190.45, price:187.11, currency:"USD"},
				{id:"SPY002", time:1419262380000, quantity:-300, basis:179.32, price:187.11, currency:"USD"}],
		"LNKD":
			[
				{id:"LNKD001", time:1420740540000, quantity:-100, basis:230, price:186, currency:"USD"}
			]
};
 */

/**
 * Function used for fetching Trades. Your implementation should `set this.trades`.
 * The server fetch callback function should return data in {@link STX.Account.Trades} format, or you must format it once received
 * @param  {funcion} cb Required Callback function to track data fetch progress. Do not remove.
 */
STX.Account.prototype.fetchTrades=function(cb){
	cb();
};

/**
 * Function used for determining FOREX. Your implementation should check symbol properties
 * @param  {String} symbol Symbol to test
 * @return  {boolean} true if Forex
 * @since 2015-11-1
 */
STX.Account.prototype.isForex=function(symbol){
	return STX.Market.Symbology.isForexSymbol(symbol);
};
/**
 * Function used for determining labeling throughout. Your implementation should check symbol properties
 * @param  {String} symbol Symbol to test
 * @return  {boolean} true if using Forex labeling (pips, amount, units) vs equity labeling (points, dollars, shares)
 * @since 2015-11-1
 */
STX.Account.prototype.tradesLikeForex=function(symbol){
	return STX.Market.Symbology.isForexSymbol(symbol);
};

/**
 * Abstract for Placing an order
 * @param {STX.TFC} tfc The TFC object
 * @param {object} order The order, in native TFC format. The abstract interface
 * is responsible for converting this order into the format required by the broker interface.
 * @param {string} order.type "order" (as opposed to "replace")
 * @param {string} order.symbol The security symbol
 * @param {string} order.action "buy","sell"
 * @param {number} order.quantity The quantity to trade
 * @param {number} [order.limit] The limit price, optional (if no limit or stop then the order is a market order)
 * @param {number} [order.stop] The stop price, optional.
 * @param {number} [order.marketIfTouched] The market if touched price, optional.
 * @param {string} order.tif "GTC" or "DAY"
 * @param {array} [order.oto] Optional OTO array, each array element contains an order in this same format
 * @param  {function} cb Callback function fc(err)
 */
STX.Account.prototype.placeOrder=function(tfc, order, cb){};

/**
 * Abstract for Modifying an order (cancel/replace)
 * @param {STX.TFC} tfc The TFC object
 * @param {object} order The modification order, in native TFC format. The abstract interface
 * is responsible for converting this order into the format required by the broker interface.
 * @param {string} order.type "replace" (as opposed to "order")
 * @param {string} order.symbol The security symbol
 * @param {string} order.id The ID of the order being modified
 * @param {string} order.action "buy" or "sell"
 * @param {object} order.limit Limit price (if one exists)
 * @param {number} order.limit.old Old limit price if there was one
 * @param {number} order.limit.new New limit price if there is one
 * @param {object} order.stop Stop price (if one exists)
 * @param {number} order.stop.old Old stop price if there was one
 * @param {number} order.stop.new New stop price if there is one
 * @param {object} order.marketIfTouched Market If Touched price (if one exists)
 * @param {number} order.marketIfTouched.old Old market if touched price if there was one
 * @param {number} order.marketIfTouched.new New market if touched price if there is one
 * @param {object} order.quantity Quantity tuple
 * @param {number} order.quantity.old Old quantity
 * @param {number} order.quantity.new New quantity
 * @param {object} order.tif TIF tuple
 * @param {string} order.tif.old Old TIF
 * @param {string} order.tif.new New TIF
 * @param {object} [order.oto] Optional tuple containing old and new oto
 * @param {object} [order.oto.old] Old OTO
 * @param {object} [order.oto.new] New OTO
 * @param  {function} cb Callback function fc(err)
 */
STX.Account.prototype.replaceOrder=function(tfc, order, cb){};

/**
 * Abstract for Canceling an order
 * @param {STX.TFC} tfc The TFC object
 * @param {object} order The order to cancel, in native TFC format. The abstract interface
 * is responsible for converting this order into the format required by the broker interface.
 * @param  {function} cb Callback function fc(err)
 */
STX.Account.prototype.cancelOrder=function(tfc, order, cb){};

/**
 * Abstract for protecting a trade
 * @param {STX.TFC} tfc The TFC object
 * @param  {Array} array of orders constituting protection (the bracket) 
 * @param  {function} cb Callback function fc(err)
 */
STX.Account.prototype.setProtection=function(tfc, order, cb){};

/**
 * Abstract for Closing all positions
 * @param {STX.TFC} tfc The TFC object
 * @param  {function} cb Callback function fc(err)
 */
STX.Account.prototype.closeAllPositions=function(tfc, cb){};

/**
 * Abstract for Closing a position
 * @param {STX.TFC} tfc The TFC object
 * @param  {object} position position to close
 * @param  {function} cb Callback function fc(err)
 */
STX.Account.prototype.closePosition=function(tfc, position, cb){};

/**
 * Abstract for Closing a trade
 * @param {STX.TFC} tfc The TFC object
 * @param  {object} trade trade to close
 * @param  {function} cb Callback function fc(err)
 */
STX.Account.prototype.closeTrade=function(tfc, trade, cb){};


/**
 * @callback STX.Account.Confirmation
 * @param {number} [commission]	The commission amount if available
 * @param {number} [fees] The fee amount if available
 * @param {number} [total] Total amount of trade
 * @param {array} [errors] Any errors
 * @param {array} [warnings] Any warnings
 */

/**
 * Confirm an order before placing it. This is optional and only for firms that support a server side
 * order confirmation (Are you sure) process. If not supported then simply call the callback
 * @param {STX.TFC} tfc The TFC object
 * @param  {object}   order The order to confirm
 * @param  {Confirmation} cb    The callback when confirmed with Confirmation object.
 */
STX.Account.prototype.confirmOrder=function(tfc, order, cb){
	cb();
};
/**
 * @callback STX.Account.Tradability
 * @param {boolean} tradable True if the symbol can be traded
 * @param {boolean} shortable True if the symbol can be shorted
 * @param {boolean} marketable True if the symbol can be traded as a market order
 */
/**
 * Determines the tradability of the requested symbol. This includes whether it's tradable at all
 * and whether it can be shorted. Override this with your own firm's logic and query.
 * @param  {string} symbol Symbol to check
 * @param {Tradability} cb Callback with tradability status
 */
STX.Account.prototype.tradability=function(symbol, cb){
	function isIndex(symbol){
		if(symbol.indexOf("$")!=-1) return true;
		if(symbol.indexOf("^")!=-1){
			if(symbol.length==7) return false; // forex symbol
			return true;
		}
		return false;
	}
	var tradability={
		tradable: true,
		shortable: true,
		marketable: true,
		decimalPrecision: null
	};
	if(!symbol){
		tradability.tradable=false;
		cb(tradability);
		return;
	}
	if(isIndex(symbol)) tradability.tradable=false;
	// shortable: check for existence of margin account
	// shortable: check easy to borrow list
	// shortable: check price > $X
	cb(tradability);
};

/**
	Demo account - A demo implementation of the STX.Account abstract class. This
	class supports placing, modifying and canceling orders. The openOrders will reflect
	the changes but are never executed. Market orders execute immediately and update
	positions. Balances and P&L are static.
	
	You should add your own code to the account fetch and order management functions. 
	See {@tutorial Trade From Chart introduction} for implementation details.
*/
STX.Account.Demo=function(){
	this.currency="USD";
	this.config={
		oto:true,
		oco:true,
		closeAll:true,
		tradeActions:true,
		vsp:"M",
		//showOpenOrdersWhenTFCClosed:true, 
	};
	
	// this is demo data only and should not be set in the constructor in a live system
	// use fetchBalances(), fetchPositions() and fetchOpenOrders() to gather your data instead.
	// see fully functional STX.Account.Demo.fetchBalances() for code sample
	// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
		this.positions={
			"IBM":{quantity:1000,basis:126.13, price:129.13, prevClose:123.13, currency:"USD"},
			"GE":{quantity:100,basis:26.11, price:24.11, prevClose:26.11, currency:"USD"},
			"SPY":{quantity:-1000,basis:187.11, price:187.11, prevClose:190.11, currency:"USD"},
			"LNKD":{quantity:-100,basis:230, price:186, prevClose:240, currency:"USD"}
		};
		this.trades={
			"IBM":[{id:"IBM001", time:1366206180000, quantity:300, basis:124.13, price:129.13, currency:"USD", protect:{limit:165, stop:135}},
			       {id:"IBM002", time:1366910520000, quantity:600, basis:127.13, price:129.13, currency:"USD"},
			       {id:"IBM003", time:1407181680000, quantity:100, basis:126.13, price:129.13, currency:"USD"}
			       ],
			"GE":[{id:"GE001", time:1433779740000, quantity:100, basis:26.11, price:24.11, currency:"USD", protect:{limit:30, stop:25}}],
			"SPY":[{id:"SPY001", time:1419262080000, quantity:-700, basis:190.45, price:187.11, currency:"USD"},
			       {id:"SPY002", time:1419262380000, quantity:-300, basis:179.32, price:187.11, currency:"USD"}],
			"LNKD":[{id:"LNKD001", time:1420740540000, quantity:-100, basis:230, price:186, currency:"USD"}]
		};
		this.openOrders={
			"IBM":[{id:"1", action:"sell", quantity:500, limit:197, tif:"GTC", currency:"USD"},
					{id:"2", action:"sell", quantity:500, limit:196, tif:"GTC", currency:"USD", vspId:"IBM002"},
					{id:"9", tradeid:"IBM001", action:"sell", quantity:300, limit:165, tif:"GTC", currency:"USD", oco:"10"},
					{id:"10", tradeid:"IBM001", action:"sell", quantity:300, stop:135, tif:"GTC", currency:"USD", oco:"9"}],
			"TSLA":[{id:"3", action:"buy", quantity:10, limit:170, tif:"DAY", currency:"USD"}],
			"GE":[{id:"4", tradeid:"GE001", action:"sell", quantity:100, limit:30, tif:"GTC", currency:"USD", oco:"5"},
					{id:"5", tradeid:"GE001", action:"sell", quantity:100, stop:25, tif:"GTC", currency:"USD", oco:"4"}
				],
			"LNKD":[
				        {id:"6", action:"buy", quantity:100, limit:112, tif:"DAY", currency:"USD", oto: 
				        	[
								{id:"7", action:"sell", quantity:100, limit:130, tif:"GTC", currency:"USD", oco:"8"},
								{id:"8", action:"sell", quantity:100, stop:110, tif:"GTC", currency:"USD", oco:"7"}
							]
				        },
						{id:"9", action:"buy", quantity:100, limit:112, tif:"DAY", currency:"USD", oto: 
							[
							 {id:"10", action:"sell", quantity:100, limit:130, tif:"GTC", currency:"USD", oco:true}		// if only one leg, set oco to true.
							]
				        },				
					]
		};
	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
};
STX.Account.Demo.stxInheritsFrom(STX.Account);

STX.Account.Demo.prototype.fetchBalances=function(cb){
	
	// make your server call here and in the request call back set balances and call cb();
	var self = this;
    STX.postAjax("https://jsfiddle.chartiq.com/sample_tfc_balances.js", null, function (status, myserverResponseData) {
        if (status != 200) {
            // something went wrong
        	cb();
            return;
        }
        if(typeof self.balances.cash=="undefined") self.balances=JSON.parse(myserverResponseData);
        cb();
    });
};

STX.Account.Demo.prototype.fetchPositions=function(cb){
	
	// make your server call here and in the request call back set positions and call cb();
	// see STX.Account.Demo.fetchBalances for working example
	cb();
};

STX.Account.Demo.prototype.fetchOpenOrders=function(cb){

	// make your server call here and in the request call back set positions and call cb();
	// see STX.Account.Demo.fetchBalances for working example
	cb();
};

STX.Account.Demo.prototype.fetchTrades=function(cb){

	// make your server call here and in the request call back set trades and call cb();
	// see STX.Account.Demo.fetchBalances for working example
	cb();
};

STX.Account.Demo.prototype.placeOrder=function(tfc, order, cb){
	if(order.constructor == Array){
		var symbol=order[0].symbol;
		if(!this.openOrders[symbol]) this.openOrders[symbol]=[];
		order[0].id=STX.uniqueID();
		order[1].id=STX.uniqueID();
		order[0].oco=order[1].id;
		order[1].oco=order[0].id;
		this.openOrders[symbol].push(order[0]);
		this.openOrders[symbol].push(order[1]);
	}else{
		if(!this.openOrders[order.symbol]) this.openOrders[order.symbol]=[];
		if(!order.limit && !order.stop){	// market orders
			this.execute(order, tfc.getCurrentPriceForOrder(order.action));
		}else{
			order.id=STX.uniqueID();
			this.openOrders[order.symbol].push(order);
		}
	}
	cb();
};

STX.Account.Demo.prototype.cancelOrder=function(tfc, order, cb){
	for(var symbol in this.openOrders){
		var openOrders=this.openOrders[symbol];
		for(var i=0;i<openOrders.length;i++){
			var openOrder=openOrders[i];
			if(order.id==openOrder.id){
				if(openOrder.tradeid && this.trades[symbol]){
					for(var t=0;t<this.trades[symbol].length;t++){
						var trade=this.trades[symbol][t];
						if(trade.id==openOrder.tradeid){
							if(openOrder.stop) delete trade.protect.stop;
							else if(openOrder.limit) delete trade.protect.limit;
							if(!trade.protect.stop && !trade.protect.limit) delete trade.protect;
							break;
						}
					}
				}
				openOrders.splice(i--,1);
			}else if(order.id==openOrder.oco){
				openOrder.oco=null;
			}
		}
	}
	cb();
};

STX.Account.Demo.prototype.replaceOrder=function(tfc, order, cb){
	for(var symbol in this.openOrders){
		var openOrders=this.openOrders[symbol];
		for(var i=0;i<openOrders.length;i++){
			var openOrder=openOrders[i];
			if(order.id==openOrder.id){
				openOrder.limit=order.limit["new"];
				openOrder.stop=order.stop["new"];
				openOrder.tif=order.tif["new"];
				openOrder.quantity=order.quantity["new"];
				if(order.oto["new"]){
					openOrder.oto=order.oto["new"];
				}else{
					delete openOrder.oto;
				}
				if(openOrder.tradeid && this.trades[symbol]){
					for(var t=0;t<this.trades[symbol].length;t++){
						var trade=this.trades[symbol][t];
						if(trade.id==openOrder.tradeid){
							if(openOrder.stop) trade.protect.stop=openOrder.stop;
							else if(openOrder.limit) trade.protect.limit=openOrder.limit;
							break;
						}
					}
				}
				cb();
				return;
			}
		}
	}
};

STX.Account.Demo.prototype.execute=function(order, price){
	var quantity=order.quantity;
	if(order.action=="sell" || order.action=="short") quantity*=-1;
	this.balances.cash-=quantity*price;
	this.balances.buyingPower=2*this.balances.cash;
	var position=this.positions[order.symbol];
	if(!position){
		this.positions[order.symbol]={quantity: quantity, basis: price, price:price, prevClose:price};
	}else{
		if(position.quantity<0){
			if(order.action=="buy") order.action="cover";
			else if(order.action=="sell") order.action="short";
		}
		if(order.action=="buy" || order.action=="short") {
			position.basis=(((position.quantity * position.basis) + (quantity*price))/(position.quantity+quantity)).toFixed(2);
		}
		position.quantity+=Number(quantity);
		position.price=price;
		if(position.quantity===0){
			delete this.positions[order.symbol];
		}
	}
	var newTrade={id: STX.uniqueID(), time: new Date().getTime(), basis: price, price:price};
	if(order.oto){
		newTrade.protect={};
		if(order.oto[0] && order.oto[0].stop) newTrade.protect.stop=order.oto[0].stop;
		else if(order.oto[1] && order.oto[1].stop) newTrade.protect.stop=order.oto[1].stop;
		if(order.oto[0] && order.oto[0].limit) newTrade.protect.limit=order.oto[0].limit;
		else if(order.oto[1] && order.oto[1].limit) newTrade.protect.limit=order.oto[1].limit;
	}
	if(!this.trades[order.symbol]) this.trades[order.symbol]=[];
	if(order.action=="buy" || order.action=="short") {
		newTrade.quantity=quantity;
		this.trades[order.symbol].push(newTrade);
	}else{
		var trades=this.trades[order.symbol];
		var qty=quantity*-1;
		for(var i=0;i<trades.length;i++){
			if(order.vspId && trades[i].id!=order.vspId) continue;

			if(Math.abs(trades[i].quantity)<=Math.abs(qty)) {
				qty-=trades[i].quantity;
				if(trades[i].protect) {
					for(var p1=0;p1<this.openOrders[order.symbol].length;p1++){
						var o1=this.openOrders[order.symbol][p1];
						if(o1.tradeid==trades[i].id){
							this.openOrders[order.symbol].splice(p1--,1);
						}
					}
				}
				trades.splice(i--,1);
			}else{
				trades[i].quantity-=qty;
				if(trades[i].protect){
					for(var p2=0;p2<this.openOrders[order.symbol].length;p2++){
						var o2=this.openOrders[order.symbol][p2];
						if(o2.tradeid==trades[i].id){
							o2.quantity-=qty;
						}
					}
				}
				qty=0;
				break;
			}
		}
		if(qty===0){
			if(!this.trades[order.symbol].length) delete this.trades[order.symbol];
		}else{
			newTrade.quantity=qty*-1;
			this.trades[order.symbol].push(newTrade);
		}
	}
	var openOrders=this.openOrders[order.symbol];
	for(var j=0;j<openOrders.length;j++){
		if(openOrders[j].id==order.id){
			openOrders.splice(j,1);
			break;
		}
	}
	if(newTrade.quantity && newTrade.protect){
		var uid=STX.uniqueID();
		if(newTrade.protect.limit) this.openOrders[order.symbol].push({id:uid+"A", tradeid:newTrade.id, action:order.action=="buy"?"sell":"cover", quantity:Math.abs(newTrade.quantity), limit:newTrade.protect.limit, tif:"GTC", oco:(newTrade.protect.stop?uid+"B":null)});
		if(newTrade.protect.stop) this.openOrders[order.symbol].push({id:uid+"B", tradeid:newTrade.id, action:order.action=="buy"?"sell":"cover", quantity:Math.abs(newTrade.quantity), stop:newTrade.protect.stop, tif:"GTC", oco:(newTrade.protect.limit?uid+"A":null)});
	}
	if(!this.openOrders[order.symbol].length) delete this.openOrders[order.symbol];
};

STX.Account.Demo.prototype.setProtection=function(tfc, order, cb){
	var id=[];
	for(var i=0;i<order.length;i++){
		id.push(order[i].tradeid+(order[i].limit?"|L":"|S"));
	}
	cb(null,{id:id});
};

STX.Account.Demo.prototype.closeAllPositions=function(tfc, cb){
	this.positions={};
	this.trades={};
	for(var symbol in this.openOrders){	
		var openOrders=this.openOrders[symbol];
		for(var i=0;i<openOrders.length;i++){
			if(openOrders[i].tradeid){
				openOrders.splice(i--,1);
			}
		}
	}
	cb();
};

STX.Account.Demo.prototype.closePosition=function(tfc, position, cb){
	var trades=this.trades[position.symbol];
	for(var i=0;i<trades.length;i++){
		var openOrders=this.openOrders[position.symbol];
		if(openOrders){
			for(var j=0;j<openOrders.length;j++){
				if(openOrders[j].tradeid==trades[i].id){
					openOrders.splice(j--,1);
				}
			}
		}
	}
	delete this.trades[position.symbol];
	delete this.positions[position.symbol];
	cb();
};

STX.Account.Demo.prototype.closeTrade=function(tfc, trade, cb){
	var trades=this.trades[trade.symbol];
	for(var i=0;i<trades.length;i++){
		if(trades[i].id==trade.id){
			trades.splice(i--,1);
			break;
		}
	}
	var position=this.positions[trade.symbol];
	if(position.quantity==trade.quantity){
		delete this.positions[trade.symbol];
	}else{
		position.basis=(((position.quantity*position.basis)-(trade.quantity*trade.basis))/(position.quantity-trade.quantity)).toFixed(2);
		position.quantity-=trade.quantity;
	}
	var openOrders=this.openOrders[trade.symbol];
	if(openOrders){
		for(i=0;i<openOrders.length;i++){
			if(openOrders[i].tradeid==trade.id){
				openOrders.splice(i--,1);
			}
		}
	}
	cb();
};
/**
 * Trade From Chart object (TFC). TFC should be constructed once and associated with an {@link STXChart} (stx)
 * object. It should also be passed a valid {@link STX.Account} which can be used for querying and placing orders.
 * The TFC object creates and manages a number of DOM elements which are located in stx-tfc.html.
 * 
 * See {@link STX.Account} for account data format and loading guidance.
 * 
 * See {@tutorial Trade From Chart introduction} for implementatin details.
 * 
 * @constructor
 * @param {object} config Configuration object
 * @param {object} config.stx     The chart object to enable TFC.
 * @param {object} config.account Valid STX.Account object for querying brokerage and placing trades
 * @param {object} [config.chart]   The specific chart (panel) for trading componentry. Defaults to the default chart.
 */
STX.TFC=function(config){
	if(!config.chart) config.chart=config.stx.chart;
	this.modifyingOrder=null;	// This will contain the open order we are currently modifying, if we are modifying an order
	this.positionIScroll=null;
	this.openOrderIScroll=null;
	this.construct(config);
	STX.I18N.translateUI();
};

/**
 * Holds references to the top level DOM elements that are used with TFC. These elements
 * are appended to the chart container in STX.TFC.prototype.construct.
 * @type {Object}
 * @property {HTMLElement} dragLineAbove The draggable line that is above the price (stop or limit)
 * @property {HTMLElement} dragLineCenter The draggable line at the center of a limit/stop order
 * @property {HTMLElement} dragLineBelow The draggable line that is below the price (stop or limit)
 * @property {HTMLElement} marketOrder The market order widget
 * @property {HTMLElement} limitOrder The limit/stop order widget
 * @property {HTMLElement} otoAbove The OTO widget above the dragLineAbove
 * @property {HTMLElement} otoBelow The OTO widget below the dragLineBelow
 * @property {HTMLElement} ocoOrder The OCO order widget (located below the ocoBelow)
 * @property {HTMLElement} ocoAbove The OCO widget that is the above line
 * @property {HTMLElement} ocoBelow The OCO widget that is the below line
 * @property {HTMLElement} shadeAbove Shading above an OCO
 * @property {HTMLElement} shadeBelow Shading below an OCO
 */
STX.TFC.prototype.dom={
	dragLineAbove:null,
	dragLineCenter:null,
	dragLineBelow:null,
	marketOrder:null,
	limitOrder:null,
	otoAbove:null,
	otoBelow:null,
	ocoOrder:null,
	ocoAbove:null,
	ocoBelow:null,
	shadeAbove:null,
	shadeBelow:null
};

/**
 * Contains references to templates (HTML objects) that are reusable
 * @property {HTMLElement} openOrderMarker The template used to create open order markers
 * @type {Object}
 */
STX.TFC.prototype.templates={
	openOrderMarker:null
};

/**
 * When a template is instantiated, a reference is saved in ephemeralNodes so that it can
 * be deleted at a future time
 * @property {array} openOrders Array of instantiated openOrders templates
 * @type {Object}
 */
STX.TFC.prototype.ephemeralNodes={
	openOrders:[]
};

/**
 * Contains references to each type of action. For each action a menu item is specified as "node".
 * The dom array should contain each of the TFC components that are to be enabled for that type of order
 * @type {Object}
 */
STX.TFC.prototype.menu={
	enableMarket:{nodes:[], dom:["marketOrder"]},
	enableBuy:{nodes:[], dom:["limitOrder","dragLineCenter"]},
	enableSell:{nodes:[], dom:["limitOrder","dragLineCenter"]},
	enableShort:{nodes:[], dom:["limitOrder","dragLineCenter"]},
	enableCover:{nodes:[], dom:["limitOrder","dragLineCenter"]},
	enableStraddle:{nodes:[], dom:["ocoOrder","ocoAbove","ocoBelow","dragLineAbove","dragLineBelow","shadeAbove","shadeBelow"]},
	enableStrangle:{nodes:[], dom:["ocoOrder","ocoAbove","ocoBelow","dragLineAbove","dragLineBelow","shadeAbove", "shadeBelow"]},
	enableBracket:{nodes:[], dom:["limitOrder","dragLineAbove","dragLineBelow","otoAbove","otoBelow", "shadeAbove", "shadeBelow"]}
};

/**
 * Contains references to all of the individual HTML elements that may need to be referenced. Each of these
 * elements would be a sub element of one of the top level elements contained in STX.TFC.prototype.dom.
 * @type {Object}
 */
STX.TFC.prototype.elements={
};

/**
 * Called from an STX.safeDrag operation when the open orders header has been grabbed.
 * @param  {Event} e A JS event from a STX.safeDrag operation (displacementY is expected)
 */
STX.TFC.prototype.dragOrdersHeader=function(e){
	var header=this.elements.openOrdersHeader;
	if(!STX.hasClassName(header, "dragging")) return;
	if(isNaN(parseInt(this.initialPosition,10))) this.initialPosition=header.parentNode.offsetTop;
	header.resizedTop=header.parentNode.offsetTop;
	var newTop=this.initialPosition+e.displacementY;
	this.refreshScrollWindows(newTop);
};

/**
 * Positions nodes at the given price.
 * @param  {number} price       The price (relative to the y-axis)
 * @param  {array} nodes       An array of nodes to move to the desired location
 * @param  {string} [where]       If either "top" or "bottom", then the node will not be allowed to overlap the noOverlap nodes
 * @param  {array} [noOverlap]   An array of nodes which cannot be overlapped
 * @param  {boolean} [keepOnChart] If true then the nodes will not be allowed to move off the chart
 */
STX.TFC.prototype.positionAtPrice=function(price, nodes, where, noOverlap, keepOnChart){
	if(!where) where="center";
	var px=this.locationFromPrice(price), node;
	for(var i=0;i<nodes.length;i++){
		var nodeName=nodes[i];
		if(typeof nodeName=="string"){
			node=this.dom[nodeName];
		}else{
			node=nodeName;
		}
		var top=null;
		var j, oNode;
		if(where=="center"){
			top=(px-(node.offsetHeight/2));
		}else if(where=="top"){
			if(noOverlap){
				for(j=0;j<noOverlap.length;j++){
					oNode=this.dom[noOverlap[j]];
					var bottom=STX.stripPX(oNode.style.top)+oNode.offsetHeight;
					if(bottom>px) px=bottom;
				}
			}
			top=Math.round(px)+1;
		}else if(where=="bottom"){
			if(noOverlap){
				for(j=0;j<noOverlap.length;j++){
					oNode=this.dom[noOverlap[j]];
					top=STX.stripPX(oNode.style.top);
					if(px>top) px=top;
				}
			}
			top=Math.round(px-node.offsetHeight);
		}
		node.removeAttribute("uncentered");
		node.removeAttribute("off-screen");
		if(keepOnChart){
			if(top<0){
				node.setAttribute("uncentered", true);
				if(top<node.offsetHeight/2*-1)
					node.setAttribute("off-screen", true);
				top=0;
			}else if(top+node.offsetHeight>this.chart.panel.height){
				node.setAttribute("uncentered", true);
				if((top+node.offsetHeight)-this.chart.panel.height>node.offsetHeight/2)
					node.setAttribute("off-screen", true);
				top=this.chart.panel.height-node.offsetHeight;
			}
		}
		if(top!==null) node.style.top=(top)+"px";
	}
};


/**
 * Enables the market order widget
 */
STX.TFC.prototype.enableMarket=function(){
	this.activeTrade="market";
	if(!this.account) return;
	this.dom.marketOrder.style.top="0px";
	if(this.account.isForex(this.stx.chart.symbol)){
		this.elements.askForexPart.style.visibility="";
		this.elements.bidForexPart.style.visibility="";
	}else{
		this.elements.askForexPart.style.visibility="hidden";
		this.elements.bidForexPart.style.visibility="hidden";
	}
	if(this.account.config.oto){
		this.elements.marketBracket.style.display="";
	}else{
		this.elements.marketBracket.style.display="none";
	}
	this.updateValues();
	this.populateMarket();
};

/**
 * Populates the market order widget with the position's shares
 */
STX.TFC.prototype.populateMarket=function(){
	this.elements.marketLossBracketDifferential.value="";
	this.elements.marketProfitBracketDifferential.value="";
	if(this.account.positions[this.chart.symbol] && this.account.config.reducePosition!==false){
		this.setActiveInput("shares");
		this.elements.marketShares.value=Math.abs(this.account.positions[this.chart.symbol].quantity);
		this.updateValues();		
	}else if(this.account.config.pts){
		this.elements.marketShares.value=1;
		this.updateValues();
	}else{
		this.setActiveInput(null);
		this.elements.marketShares.value=this.elements.marketCurrency.value="";	
	}

};

/**
 * Adjust pice to ensure it is within the stx.chart.yAxis.minimumPriceTick range
 * param {number} price The price to snal to the closest minimumPriceTick.
 * @return {number} adjusted price conforming to minimumPriceTick
 * @since 16-04-01
 */
STX.TFC.prototype.snapPrice=function(price){
	// snap the limit price to the desired interval if one defined
	var minTick=this.stx.chart.yAxis.minimumPriceTick;
	if(!minTick) minTick=0.00000001;  //maximum # places
	if ( minTick ) {
		var numToRoundTo = 1 / minTick;
		price = Math.round(price * numToRoundTo) / numToRoundTo;
	}
	
	return price;
};

/**
 * Gets the current price for placing an order.  Will return bid or ask if available, otherwise close.
 * It will adjust to ensure it is within the stx.chart.yAxis.minimumPriceTick range
 * param {string} activeTrade Type of order being placed
 * @return {number} Bid or Ask or Close, depending on the order side
 * @since 15-07-01
 */
STX.TFC.prototype.getCurrentPriceForOrder=function(activeTrade){
	var currentQuote=this.stx.currentQuote();
	var bid=null, ask=null;
	if(currentQuote){
		bid=currentQuote.Bid?currentQuote.Bid:currentQuote.Close;
		ask=currentQuote.Ask?currentQuote.Ask:currentQuote.Close;
	}
	
	var price;
	if(!activeTrade) price = currentQuote.Close;
	else price =  (activeTrade=="sell" || activeTrade=="short") ? bid : ask;
		
	return this.snapPrice(price);

};

/**
 * Sets the initial order price. This is either the current quote for the security or, if modifying an order
 * the current limit or stop price for the order.
 * @param  {object} params Optional parameters
 */
STX.TFC.prototype.initializeOrderPrice=function(params){
	this.centerPrice=this.getCurrentPriceForOrder(this.activeTrade);
	if(params && params.openOrder){
		// If we're modifying an open order then set the price to the price of the initial open order
		var price=this.centerPrice;
		if(params.openOrder.limit) price=params.openOrder.limit;
		else if(params.openOrder.stop) price=params.openOrder.stop;
		else if(params.openOrder.marketIfTouched) price=params.openOrder.marketIfTouched;
		this.centerPrice=price;
	}	
};

/**
 * Enables a buy order. 
 * 
 * Note the concept of "limit" and "stop" lose some of their meaning in the context of trading from the chart.
 * What we are actually doing is setting a price that, if the security hits that price, creates a market order. This is the true and original
 * meaning of a limit or stop order. The distinction regarding which way the stock is traveling is not significant in the context of trading
 * from the chart. As such, a "limit" order in this context could be a stop or a limit when initiating a trade.
 *
 * However, when *closing a position*, the meaning of stop and limit take on more significance. When closing a position, we want to "stop our loss"
 * or "limit our gains" and thus when we place a bracket (or one leg of a bracket) around an initial positions, we do use the "stop" and "loss" terminology.
 *
 * The "buy" order is used only for initiating a long position. @see STX.TFC.prototype.enableCover for covering a short position.
 *
 * 
 * @param  {object} [params] Initial parameters for the order, only used if we are modifying an open order and need to derive the initial price from that order.
 */
STX.TFC.prototype.enableBuy=function(params){
	this.activeTrade="buy";
	STX.swapClassName(this.dom.dragLineAbove, "red", "green");
	STX.swapClassName(this.dom.dragLineBelow, "red", "green");
	STX.swapClassName(this.dom.dragLineCenter, "green", "red");
	STX.unappendClassName(this.dom.limitOrder, "new-cover-order");
	STX.unappendClassName(this.dom.limitOrder, "new-sell-order");
	STX.unappendClassName(this.dom.limitOrder, "new-short-order");
	STX.appendClassName(this.dom.limitOrder, "new-buy-order");

	STX.unappendClassName(this.dom.limitOrder, "with-stop");
	STX.unappendClassName(this.dom.limitOrder, "with-limit");
	this.initializeOrderPrice(params);
	this.positionAtPrice(this.centerPrice, ["limitOrder","dragLineCenter"]);
	this.elements.dragLineCenterPrice.innerHTML=this.formatPrice(this.centerPrice);

	if(this.account.config.pts) this.elements.limitShares.value=1;
	if(params && params.openOrder){
		this.elements.limitShares.value=params.openOrder.quantity;
		this.elements.limitTIF.value=params.openOrder.tif;
		if(params.openOrder.oto){
			for(var oto=0;oto<params.openOrder.oto.length;oto++){
				if(params.openOrder.oto[oto].stop) this.addOTOStop(params.openOrder.oto[oto].stop);
				else if(params.openOrder.oto[oto].limit) this.addOTOLimit(params.openOrder.oto[oto].limit);
			}
		}
		if(params.openOrder.oco){
			STX.appendClassName(this.dom.limitOrder, "oco");
		}else{
			STX.unappendClassName(this.dom.limitOrder, "oco");
		}
		this.elements.limitShares.disabled=!!params.openOrder.oco;
		this.elements.limitCurrency.disabled=!!params.openOrder.oco;
		this.elements.limitTIF.disabled=!!params.openOrder.oco;
	}else{
		this.elements.limitShares.disabled=false;
		this.elements.limitCurrency.disabled=false;
		this.elements.limitTIF.disabled=false;		
	}
	//this.elements.limitTIF.focus();
};



/**
 * Enables a sell order.
 * @param  {object} [params] Initial parameters for the order, only used when modifying an open order to obtain the current limit/stop price.
 */
STX.TFC.prototype.enableSell=function(params){
	this.activeTrade="sell";
	STX.swapClassName(this.dom.dragLineCenter, "red", "green");
	STX.unappendClassName(this.dom.limitOrder, "new-cover-order");
	STX.unappendClassName(this.dom.limitOrder, "new-buy-order");
	STX.unappendClassName(this.dom.limitOrder, "new-short-order");
	STX.appendClassName(this.dom.limitOrder, "new-sell-order");
	STX.unappendClassName(this.dom.limitOrder, "with-stop");
	STX.unappendClassName(this.dom.limitOrder, "with-limit");
	var quantity=0;
	var position=this.account.positions[this.stx.chart.symbol];
	if(position) quantity=position.quantity;
	this.elements.sharesOwned.innerHTML=STX.commas(quantity);
	this.initializeOrderPrice(params);
	this.positionAtPrice(this.centerPrice, ["limitOrder","dragLineCenter"]);
	this.elements.dragLineCenterPrice.innerHTML=this.formatPrice(this.centerPrice);

	if(this.account.config.pts) this.elements.limitShares.value=1;
	if(params && params.openOrder){
		this.elements.limitShares.value=params.openOrder.quantity;
		this.elements.limitTIF.value=params.openOrder.tif;
		this.elements.limitShares.disabled=!!params.openOrder.oco;
		this.elements.limitCurrency.disabled=!!params.openOrder.oco;
		this.elements.limitTIF.disabled=!!params.openOrder.oco;
	}else{
		this.elements.limitShares.disabled=false;
		this.elements.limitCurrency.disabled=false;
		this.elements.limitTIF.disabled=false;		
	}
};

/**
 * Enable a short order (selling to open a position)
 * @param  {object} [params] Initial parameters, only used when modifying an open order to obtain the current limit/stop price.
 */
STX.TFC.prototype.enableShort=function(params){
	this.activeTrade="short";
	STX.swapClassName(this.dom.dragLineAbove, "green", "red");
	STX.swapClassName(this.dom.dragLineBelow, "green", "red");
	STX.swapClassName(this.dom.dragLineCenter, "red", "green");
	STX.unappendClassName(this.dom.limitOrder, "new-cover-order");
	STX.unappendClassName(this.dom.limitOrder, "new-sell-order");
	STX.unappendClassName(this.dom.limitOrder, "new-buy-order");
	STX.appendClassName(this.dom.limitOrder, "new-short-order");

	STX.unappendClassName(this.dom.limitOrder, "with-stop");
	STX.unappendClassName(this.dom.limitOrder, "with-limit");
	this.initializeOrderPrice(params);
	this.positionAtPrice(this.centerPrice, ["limitOrder","dragLineCenter"]);
	this.elements.dragLineCenterPrice.innerHTML=this.formatPrice(this.centerPrice);

	if(this.account.config.pts) this.elements.limitShares.value=1;
	if(params && params.openOrder){
		this.elements.limitShares.value=params.openOrder.quantity;
		this.elements.limitTIF.value=params.openOrder.tif;
		if(params.openOrder.oto){
			for(var oto=0;oto<params.openOrder.oto.length;oto++){
				if(params.openOrder.oto[oto].stop) this.addOTOStop(params.openOrder.oto[oto].stop);
				else if(params.openOrder.oto[oto].limit) this.addOTOLimit(params.openOrder.oto[oto].limit);
			}
		}
		if(params.openOrder.oco){
			STX.appendClassName(this.dom.limitOrder, "oco");
		}else{
			STX.unappendClassName(this.dom.limitOrder, "oco");
		}

	}
	this.elements.limitShares.disabled=false;
	this.elements.limitCurrency.disabled=false;
	this.elements.limitTIF.disabled=false;
};

/**
 * Enables a buy to cover order (closing a short position)
 * @param  {object} [params] Initial parameters, only used when modifying an open order to obtain the current limit/stop price.
 */
STX.TFC.prototype.enableCover=function(params){
	this.activeTrade="cover";
	STX.swapClassName(this.dom.dragLineCenter, "green", "red");
	STX.unappendClassName(this.dom.limitOrder, "new-sell-order");
	STX.unappendClassName(this.dom.limitOrder, "new-buy-order");
	STX.unappendClassName(this.dom.limitOrder, "new-short-order");
	STX.appendClassName(this.dom.limitOrder, "new-cover-order");
	STX.unappendClassName(this.dom.limitOrder, "with-stop");
	STX.unappendClassName(this.dom.limitOrder, "with-limit");
	var quantity=0;
	var position=this.account.positions[this.stx.chart.symbol];
	if(position) quantity=position.quantity;
	this.elements.sharesOwned.innerHTML=STX.commas(quantity);
	this.initializeOrderPrice(params);
	this.positionAtPrice(this.centerPrice, ["limitOrder","dragLineCenter"]);
	this.elements.dragLineCenterPrice.innerHTML=this.formatPrice(this.centerPrice);

	if(this.account.config.pts) this.elements.limitShares.value=1;
	if(params && params.openOrder){
		this.elements.limitShares.value=params.openOrder.quantity;
		this.elements.limitTIF.value=params.openOrder.tif;
	}
	this.elements.limitShares.disabled=false;
	this.elements.limitCurrency.disabled=false;
	this.elements.limitTIF.disabled=false;
};

/**
 * Enables a bracket order. A bracket order is, specifically, an OCO (one cancels the other) with stop and limit legs, to *close* an open position.
 * The bracket order will calculate the risk/reward for the open position. Note that the system does not support modification of an OCO specifically
 * but rather modification of one or the other legs. If the brokerage supports/requires modification of a complete OCO, then the translation layer
 * should make that adjustment.
 * @param  {object} [params] Initial parameters, only used when bracketing a specific trade or position to obtain the current quantity.
 */
STX.TFC.prototype.enableBracket=function(params){
	if(params && params.trade){  //bracketing a specific trade
		this.elements.bracketId.value=params.trade.id;
		this.elements.limitCurrency.readOnly=true;
		this.elements.limitShares.readOnly=true;
		this.elements.limitShares.value=Math.abs(params.trade.quantity);
		STX.unappendClassName(this.elements.removeOTOAbove,"disable");
		STX.unappendClassName(this.elements.removeOTOBelow,"disable");
	}else{
		this.elements.bracketId.value="";
		this.elements.limitCurrency.readOnly=false;
		this.elements.limitShares.readOnly=false;
		STX.appendClassName(this.elements.removeOTOAbove,"disable");
		STX.appendClassName(this.elements.removeOTOBelow,"disable");
	}

	STX.unappendClassName(this.dom.limitOrder, "new-cover-order");
	STX.unappendClassName(this.dom.limitOrder, "new-sell-order");
	STX.unappendClassName(this.dom.limitOrder, "new-short-order");
	STX.unappendClassName(this.dom.limitOrder, "new-buy-order");

	STX.unappendClassName(this.dom.shadeAbove, "tfc-profit");
	STX.unappendClassName(this.dom.shadeBelow, "tfc-profit");
	STX.swapClassName(this.dom.shadeAbove, "tfc-neutral", "tfc-loss");
	STX.swapClassName(this.dom.shadeBelow, "tfc-neutral", "tfc-loss");


	STX.appendClassName(this.dom.otoAbove, "bracket");
	STX.appendClassName(this.dom.otoBelow, "bracket");
	var position=this.account.positions[this.stx.chart.symbol];
	if(params && params.trade) position=params.trade;
	this.elements.otoAboveLegLabel.innerHTML="";
	this.elements.otoBelowLegLabel.innerHTML="";
	if(position.quantity>0){
		this.activeTrade="bracket_sell";
		STX.swapClassName(this.dom.dragLineAbove, "red", "green");
		STX.swapClassName(this.dom.dragLineBelow, "red", "green");
		STX.appendClassName(this.dom.limitOrder, "new-sell-order");
		this.elements.otoAboveLegLabel.appendChild(STX.translatableTextNode(this.stx,"Take Profit"));
		this.elements.otoBelowLegLabel.appendChild(STX.translatableTextNode(this.stx,"Stop Loss"));
	}else{
		this.activeTrade="bracket_cover";
		STX.swapClassName(this.dom.dragLineAbove, "green", "red");
		STX.swapClassName(this.dom.dragLineBelow, "green", "red");		
		STX.appendClassName(this.dom.limitOrder, "new-cover-order");
		this.elements.otoBelowLegLabel.appendChild(STX.translatableTextNode(this.stx,"Take Profit"));
		this.elements.otoAboveLegLabel.appendChild(STX.translatableTextNode(this.stx,"Stop Loss"));
	}
	this.elements.sharesOwned.innerHTML=STX.commas(position.quantity);
	this.setActiveInput("shares");

	STX.appendClassName(this.dom.limitOrder, "with-stop");
	STX.appendClassName(this.dom.limitOrder, "with-limit");
	this.centerPrice=this.getCurrentPriceForOrder();
	var y=this.stx.pixelFromPriceTransform(this.centerPrice, this.chart.panel);
	var yAbove=y-50,yBelow=y+50;
	if(params && params.trade && params.trade.protect){
		if(params.trade.quantity>0 && params.trade.protect.limit){
			yAbove=this.stx.pixelFromPriceTransform(params.trade.protect.limit, this.chart.panel);
		}else if(params.trade.quantity<0 && params.trade.protect.stop){
			yAbove=this.stx.pixelFromPriceTransform(params.trade.protect.stop, this.chart.panel);
		}
		if(params.trade.quantity>0 && params.trade.protect.stop){
			yBelow=this.stx.pixelFromPriceTransform(params.trade.protect.stop, this.chart.panel);
		}else if(params.trade.quantity<0 && params.trade.protect.limit){
			yBelow=this.stx.pixelFromPriceTransform(params.trade.protect.limit, this.chart.panel);
		}
	}
	this.positionAboveLine(this.stx.valueFromPixelUntransform(yAbove, this.chart.panel));
	this.positionBelowLine(this.stx.valueFromPixelUntransform(yBelow, this.chart.panel));
	this.updateValues();
	this.render();
};

/**
 * Enable a straddle order. A straddle is, specifically, an OCO (one cancels the other) to *open* a position. The goal of the straddle is to
 * capture a breakout from a presumed trading range. The resulting position may be either long or short.
 */
STX.TFC.prototype.enableStraddle=function(){
	this.activeTrade="straddle";
	STX.swapClassName(this.dom.dragLineAbove, "green", "red");
	STX.swapClassName(this.dom.dragLineBelow, "green", "red");
	STX.unappendClassName(this.dom.shadeAbove, "tfc-neutral");
	STX.unappendClassName(this.dom.shadeBelow, "tfc-neutral");
	STX.swapClassName(this.dom.shadeAbove, "tfc-profit", "tfc-loss");
	STX.swapClassName(this.dom.shadeBelow, "tfc-profit", "tfc-loss");
	this.elements.ocoAboveHead.innerHTML="Buy Stop";
	this.elements.ocoBelowHead.innerHTML="Sell Stop";
	this.centerPrice=this.getCurrentPriceForOrder();
	var y=this.stx.pixelFromPriceTransform(this.centerPrice, this.chart.panel);
	this.positionAboveLine(this.stx.valueFromPixelUntransform(y-50, this.chart.panel));
	this.positionBelowLine(this.stx.valueFromPixelUntransform(y+50, this.chart.panel));
	this.updateValues();
	this.render();
};

/**
 * Enable a strangle order. A strangle is, specifically, an OCO (one cancels the other) to *open* a position. The goal of the straddle is to
 * profit when a security bounces within a presumed trading range. The resulting position may be either long or short.
 */
STX.TFC.prototype.enableStrangle=function(){
	this.activeTrade="strangle";
	STX.swapClassName(this.dom.dragLineAbove, "red", "green");
	STX.swapClassName(this.dom.dragLineBelow, "red", "green");
	STX.unappendClassName(this.dom.shadeAbove, "tfc-neutral");
	STX.unappendClassName(this.dom.shadeBelow, "tfc-neutral");
	STX.swapClassName(this.dom.shadeAbove, "tfc-loss", "tfc-profit");
	STX.swapClassName(this.dom.shadeBelow, "tfc-loss", "tfc-profit");
	this.elements.ocoAboveHead.innerHTML="Sell Limit";
	this.elements.ocoBelowHead.innerHTML="Buy Limit";
	this.centerPrice=this.getCurrentPriceForOrder();
	var y=this.stx.pixelFromPriceTransform(this.centerPrice, this.chart.panel);
	this.positionAboveLine(this.stx.valueFromPixelUntransform(y-50, this.chart.panel));
	this.positionBelowLine(this.stx.valueFromPixelUntransform(y+50, this.chart.panel));
	this.updateValues();
	this.render();
};

/**
 * Adds a stop widget to an active buy or short trade. The stop widget will be either on the bottom or top depending on whether it is a buy or short trade
 * and the user can position it. When a stop (or limit) is added to such a trade, it will be placed as an OTO (one trigger other) trade.
 * @param {number} [initialPrice] - The initial price to place the trade. If not set then the price will be computed visually, so that the stop widget does
 * not overlap the buy/short widget.
 */
STX.TFC.prototype.addOTOStop=function(initialPrice){
	STX.appendClassName(this.dom.limitOrder, "with-stop");
	if(this.activeTrade=="buy"){
		this.dom.otoBelow.style.display="";
		this.dom.dragLineBelow.style.display="";
		if(!initialPrice) initialPrice=this.priceFromLocation(STX.stripPX(this.dom.limitOrder.style.top)+this.dom.limitOrder.offsetHeight);
		this.positionBelowLine(initialPrice);
		this.elements.otoBelowLegLabel.innerHTML="";
		this.elements.otoBelowLegLabel.appendChild(STX.translatableTextNode(this.stx,"Stop Loss"));
	}else if(this.activeTrade=="short"){
		this.dom.otoAbove.style.display="";
		this.dom.dragLineAbove.style.display="";
		if(!initialPrice) initialPrice=this.priceFromLocation(STX.stripPX(this.dom.limitOrder.style.top));
		this.positionAboveLine(initialPrice);
		this.elements.otoAboveLegLabel.innerHTML="";
		this.elements.otoAboveLegLabel.appendChild(STX.translatableTextNode(this.stx,"Stop Loss"));
	}
	this.updateValues();
};

/**
 * Removes the OTO order (stop or limit) that is above the buy/short order.
 */
STX.TFC.prototype.removeOTOAbove=function(){
	this.dom.otoAbove.style.display="none";
	this.dom.dragLineAbove.style.display="none";
	if(this.activeTrade=="buy"){
		STX.unappendClassName(this.dom.limitOrder, "with-limit");
	}else if(this.activeTrade=="short"){
		STX.unappendClassName(this.dom.limitOrder, "with-stop");
	}else if(this.activeTrade=="bracket_sell" || this.activeTrade=="bracket_cover"){
		if(this.dom.otoBelow.style.display=="none") this.closeTFC();
	}
};

/**
 * Adds a limit widget to an active buy or short trade. The limit widget will be either on the bottom or top depending on whether it is a buy or short trade
 * and the user can position it. When a limit (or stop) is added to such a trade, it will be placed as an OTO (one trigger other) trade.
 * @param {number} [initialPrice] - The initial price to place the trade. If not set then the price will be computed visually, so that the limit widget does
 * not overlap the buy/short widget.
 */
STX.TFC.prototype.addOTOLimit=function(initialPrice){
	STX.appendClassName(this.dom.limitOrder, "with-limit");
	if(this.activeTrade=="buy"){
		this.dom.otoAbove.style.display="";
		this.elements.otoAboveLegLabel.innerHTML="";
		this.elements.otoAboveLegLabel.appendChild(STX.translatableTextNode(this.stx,"Take Profit"));
		this.dom.dragLineAbove.style.display="";
		if(!initialPrice) initialPrice=this.priceFromLocation(STX.stripPX(this.dom.limitOrder.style.top));
		this.positionAboveLine(initialPrice);
	}else if(this.activeTrade=="short"){
		this.dom.otoBelow.style.display="";
		this.elements.otoBelowLegLabel.innerHTML="";
		this.elements.otoBelowLegLabel.appendChild(STX.translatableTextNode(this.stx,"Take Profit"));
		this.dom.dragLineBelow.style.display="";
		if(!initialPrice) initialPrice=this.priceFromLocation(STX.stripPX(this.dom.limitOrder.style.top)+this.dom.limitOrder.offsetHeight);
		this.positionBelowLine(initialPrice);
	}
	this.updateValues();
};

/**
 * Removes the OTO order that is below the buy/short order.
 */
STX.TFC.prototype.removeOTOBelow=function(){
	this.dom.otoBelow.style.display="none";
	this.dom.dragLineBelow.style.display="none";
	if(this.activeTrade=="buy"){
		STX.unappendClassName(this.dom.limitOrder, "with-stop");
	}else if(this.activeTrade=="short"){
		STX.unappendClassName(this.dom.limitOrder, "with-limit");
	}else if(this.activeTrade=="bracket_sell" || this.activeTrade=="bracket_cover"){
		if(this.dom.otoAbove.style.display=="none") this.closeTFC();
	}
};

/**
 * Sets the active input to either "shares" or "currency". This will determine which calculations are made as the user moves the tfc widgets
 * up and down the y-axis. For instance, if the user last set the currency value, then the shares will change as the tfc widgets are moved.
 * @param {string} activeInput Either "shares" or "currency".
 */
STX.TFC.prototype.setActiveInput=function(activeInput){
	this.activeInput=activeInput;
};

/**
 * Updates all of the numerical values on the screen including: shares, currency, risk/reward, profit & loss. This method is called
 * whenever the user enables or manipulates a tfc element.
 */
STX.TFC.prototype.updateValues=function(){
	if(!this.account) return;
	var currentQuote=this.stx.currentQuote();
	var bid=null, ask=null;
	if(currentQuote){
		bid=currentQuote.Bid?currentQuote.Bid:currentQuote.Close;
		ask=currentQuote.Ask?currentQuote.Ask:currentQuote.Close;
	}
	var price=this.centerPrice;
	var position=this.account.positions[this.stx.chart.symbol];
	if(this.activeTrade=="bracket_sell" || this.activeTrade=="bracket_cover"){
		if(this.elements.bracketId.value){
			var trades=this.account.trades[this.stx.chart.symbol];
			for(var t=0;t<trades.length;t++) {
				if(trades[t].id==this.elements.bracketId.value) price=trades[t].basis;
			}
		}
		else if(position) price=Math.abs(position.basis);
	}
	var amount=null;
	var quantity=null;
	var currency=this.account.currency;
	if(this.stx.chart.symbol){
		if(this.account.currencyFromSymbol) currency=this.account.currencyFromSymbol(this.stx.chart.symbol);
		else if(this.account.isForex(this.stx.chart.symbol)){
			currency=this.stx.chart.symbol.substr(this.stx.chart.symbol.length-3,3);
		}
	}
	var lossBracketDifferential=null;
	var profitBracketDifferential=null;
	if(this.activeTrade=="market"){
		if(!currentQuote) return;
		if(this.activeInput=="shares"){
			quantity=this.quantityFromValue(this.elements.marketShares.value);
			amount=quantity*currentQuote.Close;  //since we don't know whether to use bid or ask
			if(amount>0) STX.setValueIfNotActive(this.elements.marketCurrency, amount.toFixed(0));
		}else if(this.activeInput=="currency"){
			amount=this.quantityFromValue(this.elements.marketCurrency.value);
			quantity=Math.round(amount/currentQuote.Close);  //since we don't know whether to use bid or ask
			if(quantity>0) STX.setValueIfNotActive(this.elements.marketShares, quantity);
		}
		lossBracketDifferential=Math.abs(this.quantityFromValue(this.elements.marketLossBracketDifferential.value));
		profitBracketDifferential=Math.abs(this.quantityFromValue(this.elements.marketProfitBracketDifferential.value));
		if(this.account.isForex(this.stx.chart.symbol)){
			var str=bid.toString();
			var wholePart=str.substring(0, str.indexOf("."));
			if(wholePart==="") wholePart="0";
			var decimalPart=str.substring(str.indexOf(".")+1);
			var equityPart=wholePart+"."+ decimalPart.substring(0,2);
			var strong=decimalPart.substring(2,4);
			var sub=decimalPart.substring(4,5);
			this.elements.bidEquityPart.innerHTML=equityPart;
			this.elements.bidForexPart.innerHTML=strong + "<SUP>" + sub + "</SUP>";

			str=ask.toString();
			wholePart=str.substring(0, str.indexOf("."));
			if(wholePart==="") wholePart="0";
			decimalPart=str.substring(str.indexOf(".")+1);
			equityPart=wholePart+"."+ decimalPart.substring(0,2);
			strong=decimalPart.substring(2,4);
			sub=decimalPart.substring(4,5);
			this.elements.askEquityPart.innerHTML=equityPart;
			this.elements.askForexPart.innerHTML=strong + "<SUP>" + sub + "</SUP>";
		}else{
			this.elements.askEquityPart.innerHTML=this.formatPrice(ask);
			this.elements.bidEquityPart.innerHTML=this.formatPrice(bid);
		}
		if(amount>0) STX.setValueIfNotActive(this.elements.marketCurrency, STX.commas(amount.toFixed(2)));
		if(quantity>0) STX.setValueIfNotActive(this.elements.marketShares, STX.commas(quantity));
		if(lossBracketDifferential) STX.setValueIfNotActive(this.elements.marketLossBracketDifferential, lossBracketDifferential);
		if(profitBracketDifferential) STX.setValueIfNotActive(this.elements.marketProfitBracketDifferential, profitBracketDifferential);
	}else{
		if(this.limitFlippedToMarket){
			price=this.getCurrentPriceForOrder(this.activeTrade);
			this.positionCenterLine(price);
		}
		if(this.activeInput=="shares"){
			quantity=this.quantityFromValue(this.elements.limitShares.value);
			amount=quantity*price;
			STX.setValueIfNotActive(this.elements.limitCurrency, amount.toFixed(0));
		}else if(this.activeInput=="currency"){
			amount=this.quantityFromValue(this.elements.limitCurrency.value);
			quantity=Math.round(amount/price);
			STX.setValueIfNotActive(this.elements.limitShares, quantity);
		}
		if(amount || amount===0) STX.setValueIfNotActive(this.elements.limitCurrency, STX.commas(amount.toFixed(2)));
		if(quantity || quantity===0) STX.setValueIfNotActive(this.elements.limitShares, STX.commas(quantity));
	}
	var gainLoss, stopAmount, limitAmount, percentGL, risk, reward, ratio;
	if(this.activeTrade=="buy" || this.activeTrade=="bracket_sell"){
		stopAmount=quantity*this.belowPrice;
		gainLoss=stopAmount-amount;
		percentGL=(this.belowPrice-price)/price;
		risk=percentGL;

		if(gainLoss>0) gainLoss="+" + STX.money(gainLoss, null, STX.convertCurrencyCode(currency));
		else gainLoss="-" + STX.money(Math.abs(gainLoss), null, STX.convertCurrencyCode(currency));

		percentGL=STX.commas((percentGL*100).toFixed(2)) + "%";
		if(percentGL>0) percentGL="+" + percentGL;

		if(quantity) this.elements.belowGainAmount.innerHTML=gainLoss;
		this.elements.belowGainPercent.innerHTML=percentGL;

		limitAmount=quantity*this.abovePrice;
		gainLoss=limitAmount-amount;
		percentGL=(this.abovePrice-price)/price;
		reward=percentGL;

		if(gainLoss>0) gainLoss="+" + STX.money(gainLoss,null, STX.convertCurrencyCode(currency));
		else gainLoss="-" + STX.money(Math.abs(gainLoss), null, STX.convertCurrencyCode(currency));

		percentGL=STX.commas((percentGL*100).toFixed(2)) + "%";
		if(percentGL>0) percentGL="+" + percentGL;

		if(quantity) this.elements.aboveGainAmount.innerHTML=gainLoss;
		this.elements.aboveGainPercent.innerHTML=percentGL;
		if(risk && reward){
			ratio=reward/Math.abs(risk);
			this.elements.limitRiskReward.innerHTML="1 : "+ ratio.toFixed(1);
		}
	}

	if(this.activeTrade=="short" || this.activeTrade=="bracket_cover"){
		stopAmount=quantity*this.abovePrice;
		gainLoss=amount-stopAmount;
		percentGL=risk=(price-this.abovePrice)/price;
		risk=percentGL;

		if(gainLoss>0) gainLoss="+" + STX.money(gainLoss,null, STX.convertCurrencyCode(currency));
		else gainLoss="-" + STX.money(Math.abs(gainLoss), null, STX.convertCurrencyCode(currency));

		percentGL=STX.commas((percentGL*100).toFixed(2)) + "%";
		if(percentGL>0) percentGL="+" + percentGL;

		if(quantity) this.elements.aboveGainAmount.innerHTML=gainLoss;
		this.elements.aboveGainPercent.innerHTML=percentGL;

		limitAmount=quantity*this.belowPrice;
		gainLoss=amount-limitAmount;
		percentGL=(price-this.belowPrice)/price;
		reward=percentGL;

		if(gainLoss>0) gainLoss="+" + STX.money(gainLoss,null, STX.convertCurrencyCode(currency));
		else gainLoss="-" + STX.money(Math.abs(gainLoss), null, STX.convertCurrencyCode(currency));

		percentGL=STX.commas((percentGL*100).toFixed(2)) + "%";
		if(percentGL>0) percentGL="+" + percentGL;

		if(quantity) this.elements.belowGainAmount.innerHTML=gainLoss;
		this.elements.belowGainPercent.innerHTML=percentGL;
		if(risk && reward){
			ratio=reward/Math.abs(risk);
			this.elements.limitRiskReward.innerHTML="1 : "+ ratio.toFixed(1);
		}
	}
	var basis;
	if(this.activeTrade=="sell" && position){
		if(!quantity || quantity>position.quantity){
			quantity=position.quantity;
		}
		amount=quantity*this.centerPrice;
		basis=position.basis*quantity;
		gainLoss=amount-basis;
		percentGL=gainLoss/basis;

		if(gainLoss>0) gainLoss="+" + STX.money(gainLoss,null, STX.convertCurrencyCode(currency));
		else gainLoss="-" + STX.money(Math.abs(gainLoss), null, STX.convertCurrencyCode(currency));

		percentGL=STX.commas((percentGL*100).toFixed(2)) + "%";
		if(percentGL>0) percentGL="+" + percentGL;

		this.elements.gainAmount.innerHTML=gainLoss;
		this.elements.gainPercent.innerHTML=percentGL;
	}
	if(this.activeTrade=="cover" && position){
		if(!quantity || Math.abs(quantity)>Math.abs(position.quantity)){
			quantity=position.quantity;
		}
		quantity=Math.abs(quantity);
		amount=quantity*this.centerPrice;
		basis=Math.abs(position.basis)*quantity;
		gainLoss=basis-amount;
		percentGL=gainLoss/basis;

		if(gainLoss>0) gainLoss="+" + STX.money(gainLoss,null, STX.convertCurrencyCode(currency));
		else gainLoss="-" + STX.money(Math.abs(gainLoss), null, STX.convertCurrencyCode(currency));

		percentGL=STX.commas((percentGL*100).toFixed(2)) + "%";
		if(percentGL>0) percentGL="+" + percentGL;

		this.elements.gainAmount.innerHTML=gainLoss;
		this.elements.gainPercent.innerHTML=percentGL;
	}

	if(this.activeTrade=="straddle" || this.activeTrade=="strangle"){
		amount=parseFloat(this.elements.ocoCurrency.value);
		if(isNaN(amount)) amount=0;
		quantity=Math.round(amount/this.abovePrice);
		this.elements.ocoAboveShares.innerHTML=STX.commas(quantity);

		quantity=Math.round(amount/this.belowPrice);
		this.elements.ocoBelowShares.innerHTML=STX.commas(quantity);
	}
	var e;
	var tradesLikeForex=this.account.tradesLikeForex(this.stx.chart.symbol);
	if(tradesLikeForex){
		for(e=0;e<this.elements.useDollarsLabel.length;e++){
			this.elements.useDollarsLabel[e].style.display="none";
			this.elements.useAmountLabel[e].style.display="";
		}
		for(e=0;e<this.elements.useSharesLabel.length;e++){
			this.elements.useSharesLabel[e].style.display="none";
			this.elements.useUnitsLabel[e].style.display="";
		}
		for(e=0;e<this.elements.usePipsLabel.length;e++){
			this.elements.usePointsLabel[e].style.display="none";
			this.elements.usePipsLabel[e].style.display="";
		}
	}else{
		for(e=0;e<this.elements.useAmountLabel.length;e++){
			this.elements.useAmountLabel[e].style.display="none";
			this.elements.useDollarsLabel[e].style.display="";
		}		
		for(e=0;e<this.elements.useUnitsLabel.length;e++){
			this.elements.useUnitsLabel[e].style.display="none";
			this.elements.useSharesLabel[e].style.display="";
		}
		for(e=0;e<this.elements.usePointsLabel.length;e++){
			this.elements.usePipsLabel[e].style.display="none";
			this.elements.usePointsLabel[e].style.display="";
		}
	}
	if(window.setMarketOrderPlaceholders) setMarketOrderPlaceholders(this,tradesLikeForex);
};

/**
 * Positions the center line at the requested price. The center line is the line that runs through the middle of a buy,sell,short,cover widget and
 * represents the limit or stop price for the trade.
 * @param  {number} price The price to set the center line
 * @param {boolean} [keepOnChart=true] Optionall prevent the node from being displayed off the chart
 */
STX.TFC.prototype.positionCenterLine=function(price, keepOnChart){
	if(keepOnChart!==false) keepOnChart=true;
	this.centerPrice=price;
	this.positionAtPrice(this.centerPrice, ["limitOrder","dragLineCenter"], "center", null, keepOnChart);
	this.elements.dragLineCenterPrice.innerHTML=this.formatPrice(this.centerPrice);
	this.positionBelowLine(Math.min(this.centerPrice, this.belowPrice));
	this.positionAboveLine(Math.max(this.centerPrice, this.abovePrice));
};

/**
 * Positions the "above line" which is the top line in an OCO or OTO order. For OTO orders, it is made sure that the above element does not
 * overlap the order element, but does allow the above line to slide underneath.
 * @param  {number} price The price to set the above line
 */
STX.TFC.prototype.positionAboveLine=function(price, keepOnChart){
	if(keepOnChart!==false) keepOnChart=true;
	if(isNaN(price)) return;
	this.abovePrice=this.snapPrice(price);
	this.positionAtPrice(this.abovePrice, ["dragLineAbove"], "center", null, keepOnChart);
	this.elements.dragLineAbovePrice.innerHTML=this.formatPrice(this.abovePrice);
	if(this.activeTrade=="short" || this.activeTrade=="buy"){
		this.positionAtPrice(this.abovePrice, ["otoAbove"], "bottom", ["limitOrder"], keepOnChart);
	}else if(this.activeTrade=="strangle" || this.activeTrade=="straddle"){
		this.positionAtPrice(this.abovePrice, ["ocoAbove"], "bottom", null, keepOnChart);
	}else if(this.activeTrade=="bracket_sell"){
		this.positionAtPrice(this.abovePrice, ["otoAbove"], "bottom", null, keepOnChart);
	}else if(this.activeTrade=="bracket_cover"){
		this.positionAtPrice(this.abovePrice, ["otoAbove"], "bottom", null, keepOnChart);
	}
};

/**
 * Positions the "below line" which is the bottom line in an OCO or OTO order. For OTO orders, it is made sure that the below element does not
 * overlap the order element, but does allow the below line to slide underneath.
 * @param  {number} price The price to set the below line
 */
STX.TFC.prototype.positionBelowLine=function(price, keepOnChart){
	if(keepOnChart!==false) keepOnChart=true;
	if(isNaN(price)) return;
	this.belowPrice=this.snapPrice(price);
	this.positionAtPrice(this.belowPrice, ["dragLineBelow"], "center", null, keepOnChart);
	this.elements.dragLineBelowPrice.innerHTML=this.formatPrice(this.belowPrice);
	if(this.activeTrade=="buy" || this.activeTrade=="short"){
		this.positionAtPrice(this.belowPrice, ["otoBelow"], "top", ["limitOrder"], keepOnChart);
	}else if(this.activeTrade=="strangle" || this.activeTrade=="straddle"){
		this.positionAtPrice(this.belowPrice, ["ocoBelow"], "top", null, keepOnChart);
		this.dom.ocoOrder.style.top=this.dom.ocoBelow.style.top;
	}else if(this.activeTrade=="bracket_sell" || this.activeTrade=="bracket_cover"){
		this.positionAtPrice(this.belowPrice, ["otoBelow"], "top", null, keepOnChart);
		this.dom.limitOrder.style.top=(STX.stripPX(this.dom.otoBelow.style.top)+this.dom.otoBelow.clientHeight)+"px";
	}

};

/**
 * Places the currently enabled elements along their y axis depending on the prices that have been set. This gets called whenever
 * the screen is panned, zoomed or resized because the placement is relative to the size of the chart itself. It also ensures
 * that the shaded areas do not extend past the top and bottom of the chart panel.
 */
STX.TFC.prototype.render=function(){
	if(this.activeTrade=="sell" || this.activeTrade=="cover"){
		this.positionCenterLine(this.centerPrice);
	}else if(this.activeTrade=="buy" || this.activeTrade=="short"){
		this.positionCenterLine(this.centerPrice);
		this.positionAboveLine(this.abovePrice);
		this.positionBelowLine(this.belowPrice);
	}else if(this.activeTrade=="straddle" || this.activeTrade=="strangle"){
		this.positionAboveLine(this.abovePrice);
		this.positionBelowLine(this.belowPrice);		
	}
	if(this.activeTrade=="bracket_sell" || this.activeTrade=="bracket_cover"){
		this.positionAboveLine(this.abovePrice);
		this.positionBelowLine(this.belowPrice);
		this.dom.shadeAbove.style.top="0px";
		this.dom.shadeAbove.style.bottom=(this.chart.panel.height-this.locationFromPrice(this.abovePrice)) + "px";
		this.dom.shadeBelow.style.top=this.locationFromPrice(this.belowPrice) + "px";
		this.dom.shadeBelow.style.bottom="0px";
	}
	if(this.activeTrade=="straddle" || this.activeTrade=="strangle"){
		this.dom.shadeAbove.style.top="0px";
		this.dom.shadeAbove.style.bottom=(this.chart.panel.height-this.locationFromPrice(this.abovePrice)) + "px";
		this.dom.shadeBelow.style.top=this.locationFromPrice(this.belowPrice) + "px";
		this.dom.shadeBelow.style.bottom="0px";
	}
	this.renderTrades();
	this.renderOpenOrders();
};

/**
 * This method should be called whenever the symbol is changed. Any existing, unfinished orders will be closed out. New open orders
 * will be fetched and displayed.
 */
STX.TFC.prototype.changeSymbol=function(){
	if(!this.account) return;
	if(this.activeTrade=="market"){
		this.enableMarket();
	}else if(this.activeTrade){
		this.closeTFC();
	}
	this.configureMenu();
	this.updateData();
	this.populateMarket();
};

/**
 * Returns the price given the location (top) of a node. Adjusts for panel position in the chart.
 * It will adjust to ensure it is within the stx.chart.yAxis.minimumPriceTick range
 * @param  {number} y The location of the node (assumed to be included in a holder that is aligned with the chart panel)
 * @return {number}   The price represented by that y position
 */
STX.TFC.prototype.priceFromLocation=function(y){
	var price=this.stx.valueFromPixelUntransform(y+this.chart.panel.top, this.chart.panel);
	
	return this.snapPrice(price);
};

/**
 * Returns the y-position for a node given the price
 * @param  {number} p The requested price
 * @return {number}   The y-position (within the chart panel)
 */
STX.TFC.prototype.locationFromPrice=function(p){
	return this.stx.pixelFromPriceTransform(p, this.chart.panel)-this.chart.panel.top;
};

/**
 * Called from an STX.safeDrag operation when the center line has been grabbed. Recalculates the center price and repositions the center elements.
 * @param  {Event} e A JS event from a STX.safeDrag operation (displacementY is expected)
 */
STX.TFC.prototype.dragCenterLine=function(e){
	if(!STX.hasClassName(this.dom.dragLineCenter, "dragging")) return;
	if(this.activeTrade=="bracket_cover" || this.activeTrade=="bracket_sell") return;	// prevent an error if the order portion of bracket is grabbed
	var newTop=this.initialPosition+e.displacementY;
	var newCenter=newTop+(this.dom.dragLineCenter.offsetHeight/2);
	var newPrice=this.priceFromLocation(newCenter);
	this.positionCenterLine(newPrice);
	this.updateValues();
};

/**
 * Called from an STX.safeDrag operation when the above line has been grabbed. Recalculates the above price and repositions the above elements.
 * @param  {Event} e A JS event from a STX.safeDrag operation (displacementY is expected)
 */
STX.TFC.prototype.dragAboveLine=function(e){
	var newTop=this.initialPosition+e.displacementY;
	var newCenter=newTop+(this.dom.dragLineAbove.offsetHeight/2);
	var newPrice=this.priceFromLocation(newCenter);
	if(this.activeTrade=="buy" || this.activeTrade=="short" || this.activeTrade=="bracket_sell" || this.activeTrade=="bracket_cover"){
		if(newPrice<this.centerPrice) newPrice=this.centerPrice;
	}else if(this.activeTrade=="strangle" || this.activeTrade=="straddle"){
		var currentPrice=this.stx.currentQuote().Close;
		if(newPrice<currentPrice) newPrice=currentPrice;	// straddle/strangle cannot be inside current market price
	}
	this.positionAboveLine(newPrice);
	this.updateValues();
	this.render();
};

/**
 * Called from an STX.safeDrag operation when the below line has been grabbed. Recalculates the below price and repositions the below elements.
 * @param  {Event} e A JS event from a STX.safeDrag operation (displacementY is expected)
 */
STX.TFC.prototype.dragBelowLine=function(e){
	var newTop=this.initialPosition+e.displacementY;
	var newCenter=newTop+(this.dom.dragLineBelow.offsetHeight/2);
	var newPrice=this.priceFromLocation(newCenter);
	if(this.activeTrade=="buy" || this.activetrade=="short" || this.activeTrade=="bracket_sell" || this.activeTrade=="bracket_cover"){
		if(newPrice>this.centerPrice) newPrice=this.centerPrice;
	}else if(this.activeTrade=="strangle" || this.activeTrade=="straddle"){
		var currentPrice=this.stx.currentQuote().Close;
		if(newPrice>currentPrice) newPrice=currentPrice;	// straddle/strangle cannot be inside current market price
	}
	this.positionBelowLine(newPrice);
	this.updateValues();
	this.render();
};

/**
 * Hides all of the top level widgets contained in STX.TFC.prototype.dom. This is called when closing the TFC.
 */
STX.TFC.prototype.hideAllDOM=function(){
	for(var componentName in this.dom){
		var component=this.dom[componentName];
		component.style.display="none";
	}
};

/**
 * Removes all of the ephemeral nodes (open order tags). This occurs typically when the symbol is changed. Or TFC is disabled.
 * @param  {string} which Which ephemeral nodes to clear out (i.e. "openOrders")
 */
STX.TFC.prototype.clearEphemeral=function(which){
	var nodes=this.ephemeralNodes[which];
	for(var i=0;i<nodes.length;i++){
		var node=nodes[i];
		this.holder.removeChild(node);
	}
	this.ephemeralNodes[which]=[];
};

/**
 * Instantiates a new element from a template. The new element is ephemeral, and stored in STX.TFC.prototype.ephemeralNodes.
 * @param  {HTMLElement} template The template to utilize
 * @param  {string} which    Which type of ephemeral node this is (i.e. "openOrders")
 * @return {HTMLElement}          The newly instantiated node
 */
STX.TFC.prototype.instantiateTemplate=function(template, which){
	var node=this.templates[template].cloneNode(true);
	this.holder.appendChild(node);
	this.ephemeralNodes[which].push(node);
	node.style.display="";
	return node;
};

/**
 * Creates a text printable description of an order. This is used when generating various types of order tickets.
 * @param  {object} order An order object
 * @return {string}       A text description of the order
 */
STX.TFC.prototype.createDescription=function(order){
	var description=order.action;
	description+=" " + STX.commas(order.quantity);
	description+=" @ ";
	if(order.limit) description+=order.limit;
	else if(order.stop) description+=order.stop;
	else if(order.marketIfTouched) description+=order.marketIfTouched;
	else description+="MKT";
	return description.capitalize();
};

/**
 * Enables/creates the widgets necessary to modify an open order. The same widgets that are used to create a new order are used, so the
 * main job of this function is to figure out the type of order and instantiate those widgets at the price levels of the current open order.
 * @param  {HTMLElement} openOrderMarker The open order marker to modify. It is assumed that the marker contains a reference to the actual open order.
 */
STX.TFC.prototype.modifyOpenOrder=function(openOrderMarker){
	var openOrderMarkers=this.ephemeralNodes.openOrders;
	//var position=this.account.positions[this.stx.chart.symbol];
	//var quantity=0;
	//if(position) quantity=position.quantity;
	var openOrder=openOrderMarker.openOrder;
	this.modifyingOrder=openOrder;			// Use this when submitting the modification

	this.renderOpenOrders();	// this will hide the now modifyingOrder

	// Now enable the trade components to modify this order

	this.setActiveInput("shares");	// Trigger updates to dollar values
	STX.appendClassName(this.dom.limitOrder, "tfc-cancel");
	if(openOrder.action=="buy" || openOrder.action=="cover"){
		STX.appendClassName(this.elements.limitReplace, "green");
	}else{
		STX.unappendClassName(this.elements.limitReplace, "green");
	}
	this.elements.cancelDescription.innerHTML=this.createDescription(openOrder);
	if(openOrder.action=="buy"){
		this.newTrade("enableBuy", {"openOrder":openOrder});
	}else if(openOrder.action=="cover"){
		this.newTrade("enableCover", {"openOrder":openOrder});
	}else if(openOrder.action=="sell"){
		this.newTrade("enableSell", {"openOrder":openOrder});
	}else if(openOrder.action=="short"){
		this.newTrade("enableShort", {"openOrder":openOrder});
	}
	if(openOrder.oto){	// Enable and position the OTO elements, if any
		if(openOrder.action=="buy"){
			this.activeTrade="buy";
		}else{
			this.activeTrade="short";
		}
		for(var i=0;i<openOrder.oto.length;i++){
			var order=openOrder.oto[i];
			if(order.stop){
				this.addOTOStop(order.stop);
			}else if(order.limit){
				this.addOTOLimit(order.limit);
			}
		}
	}
	if(this.account.config.disableModifyOrderQuantity){
		this.elements.limitCurrency.readOnly=true;
		this.elements.limitShares.readOnly=true;
	}
};

/**
 * Determines whether a and b overlap vertically on the screen. This method is specific to TFC, assuming that elements are positioned using style.top.
 * @param  {HTMLElement} a The first element
 * @param  {HTMLElement} b The second element
 * @return {boolean}   True if they overlap, otherwise false.
 */
STX.TFC.prototype.overlap=function(a, b){
	var t1=STX.stripPX(a.style.top);
	var b1=t1+a.offsetHeight;
	var t2=STX.stripPX(b.style.top);
	var b2=t2+b.offsetHeight;
	if(t1==t2) return true;
	if(t1<t2 && b1>t2) return true;
	if(t1>t2 && t1<b2) return true;
	return false;
};


/**
	Positions the trade lines on the chart. These demarcate the holdings and their bases.  These will begin at the acquisition date and extend to the right.
*/
STX.TFC.prototype.renderTrades=function(){
	if(!this.account) return;
	var trades=this.account.trades[this.stx.chart.symbol];
	if(trades && trades.length>0){
		for(var i=0;i<trades.length;i++){
			var trade=trades[i];
			var panel=this.stx.panels[this.chart.name];
			this.stx.startClip(panel.name);
			var t0=this.stx.tickFromDate(STX.yyyymmddhhmm(new Date(trade.time)));
			var x0=this.stx.pixelFromTick(t0);
			var x1=this.stx.pixelFromTick(this.stx.chart.dataSet.length);
			var y=this.stx.pixelFromValueAdjusted(panel, t0, trade.basis);
			var style="stx-trade-position-line-down";
			if(trade.price>trade.basis && trade.quantity>0) style="stx-trade-position-line-up";
			else if(trade.price<trade.basis && trade.quantity<0) style="stx-trade-position-line-up";
			this.stx.canvasColor(style);
			style=this.stx.canvasStyle(style);
			if(this.chart.right>x0){
				this.stx.plotLine(Math.max(this.chart.left,x0),this.chart.right,y,y,style,"ray",this.chart.context,true,{pattern:"dotted"});	
				this.chart.context.lineWidth=1;
				this.chart.context.beginPath();
				this.chart.context.arc(x0, y, 3, 0, 2*Math.PI, false);
				this.chart.context.fill();
				this.chart.context.closePath();
				if(y<this.chart.bottom && y>this.chart.top){
					this.stx.endClip();
					var txt=Number(trade.basis);
					if(panel.chart.transformFunc) txt=panel.chart.transformFunc(this.stx, panel.chart, txt);
					if(panel.yAxis.priceFormatter)
						txt=panel.yAxis.priceFormatter(this.stx, panel, txt);
					else
						txt=this.stx.formatYAxisPrice(txt, panel);
					this.stx.createYAxisLabel(panel, txt, y, style.backgroundColor, style.color);
					this.chart.context.strokeStyle=style.color;
					this.chart.context.stroke();
					this.stx.startClip(panel.name);
				}
			}
			this.stx.endClip();
		}
	}
};

/**
	Positions the open orders on the screen at the appropriate location. If they are off the y-axis then they will pile up at the top
	or bottom of the screen. If a marker overlaps another then it's width is extended so that it can be visible.
*/

STX.TFC.prototype.renderOpenOrders=function(){
	var openOrderMarkers=this.ephemeralNodes.openOrders;
	var i;
	var openOrderMarker;
	for(i=0;i<openOrderMarkers.length;i++){
		openOrderMarker=openOrderMarkers[i];
		openOrderMarker.style.display="";
		openOrderMarker.style.width="";
		var openOrder=openOrderMarker.openOrder;
		var price=null;
		if(openOrder.limit) price=openOrder.limit;
		else if(openOrder.stop) price=openOrder.stop;
		else if(openOrder.marketIfTouched) price=openOrder.marketIfTouched;
		else price=this.getCurrentPriceForOrder(openOrder.action); // market order
		this.positionAtPrice(price, [openOrderMarker],"center", null, true);
		var overlapOffset=0;
		for(var j=i+1;j<openOrderMarkers.length;j++){
			var potentialOverlap=openOrderMarkers[j];
			if(this.overlap(openOrderMarker, potentialOverlap)){
				overlapOffset+=30;
			}
		}
		if(this.activeTrade && this.activeTrade!="market"){
			openOrderMarker.style.width="425px";			
		}
		if(overlapOffset){
			openOrderMarker.style.width=(openOrderMarker.offsetWidth+overlapOffset)+"px";
		}
	}
	// hide any associated with the current modifyingOrder
	for(i=0;i<openOrderMarkers.length;i++){
		openOrderMarker=openOrderMarkers[i];
		if(this.modifyingOrder && this.modifyingOrder.id==openOrderMarker.openOrder.id){
			openOrderMarker.style.display="none";

			if(openOrderMarker.linked){
				for(var k=0;k<openOrderMarker.linked.length;k++)
					openOrderMarker.linked[k].style.display="none";
			}
		}
	}
};

/**
	Create the open order markers
*/

/**
 * Creates the open order markers and attaches safe mouse/touch events to them. An open order can be modified by clicking on it. Also,
 * crosshairs are turned off as a user hovers over an open order marker. This method is called recursively for OTO orders. OTO orders
 * are given the "pending" class attachment to render them differently. Clicking on an OTO pulls up the modification of the base order (including OTO legs).
 * @param  {object} openOrder       An open order in the expected format
 * @param  {object} [baseOrderMarker] The linked order if it is an OTO order.
 */
STX.TFC.prototype.createOpenOrderMarker=function(openOrder, baseOrderMarker){
	var openOrderMarker=this.instantiateTemplate("openOrderMarker", "openOrders");
	openOrderMarker.openOrder=openOrder;
	var priceNode=$$$(".tfc-price", openOrderMarker);
	/*if(openOrder.limit) priceNode.innerHTML=openOrder.limit;
	else if(openOrder.stop) priceNode.innerHTML=openOrder.stop;
	else priceNode.innerHTML="MKT";*/
	priceNode.innerHTML=openOrder.quantity;
	if(!openOrder.limit && !openOrder.stop && !openOrder.marketIfTouched) priceNode.innerHTML+=" MKT";

	if(openOrder.action=="sell" || openOrder.action=="short"){
		STX.swapClassName(openOrderMarker, "red", "green");
	}else{
		STX.swapClassName(openOrderMarker, "green", "red");				
	}
	if(baseOrderMarker){
		STX.appendClassName(openOrderMarker, "pending");	// OTO orders
	}
	var whichMarker=openOrderMarker;
	if(baseOrderMarker){
		whichMarker=baseOrderMarker;
		if(!baseOrderMarker.linked) baseOrderMarker.linked=[];	// Link any OTO markers so that we can hide them when modifying
		baseOrderMarker.linked.push(openOrderMarker);
	}
	// parent node is the arrow as a whole
	STX.safeClickTouch(priceNode.parentNode, function(self, whichMarker){return function(){self.crosshairsOn();self.modifyOpenOrder(whichMarker);};}(this, whichMarker));
	STX.safeMouseOver(openOrderMarker, function(self){ return function(e){self.crosshairsOff();};}(this));
	STX.safeMouseOut(openOrderMarker, function(self){ return function(e){self.crosshairsOn();};}(this));

	if(openOrder.oto){
		for(var i=0;i<openOrder.oto.length;i++){
			var order=openOrder.oto[i];
			this.createOpenOrderMarker(order, openOrderMarker);
		}
	}
};

/**
 * Creates open order markers from the openOrders in the Account object
 */
STX.TFC.prototype.deriveOpenOrderMarkers=function(){
	this.clearEphemeral("openOrders");
	if( !this.account.config.showOpenOrdersWhenTFCClosed && STX.hasClassName($$$(".stx-trade-panel"), "closed")) return;
	var openOrders=this.account.openOrders[this.stx.chart.symbol];
	if(openOrders && openOrders.length>0){
		for(var i=0;i<openOrders.length;i++){
			var openOrder=openOrders[i];
			if(openOrder.cancelled) continue;
			this.createOpenOrderMarker(openOrder);
		}
		this.renderOpenOrders();
	}
};


/**
 * Creates the balances, open orders and positions tables for the current security, first by fetching the data, then by creating markers for them, and finally by rendering the markers
 * @param {boolean} immediate If true then new data is not fetched but the existing data is simply re-rendered, for instance when switching symbols
 */
STX.TFC.prototype.updateData=function(){
	var self=this;
	var fetched={
		fetched: 0
	};

	function closure(params){
		return function(){
			if(params.tfc.selectSymbol) params.tfc.selectSymbol(params.symbol);
			if(params.type=="position" && params.tfc.account.config.reducePosition!==false){
				params.tfc.setActiveInput("shares");
				params.tfc.elements.marketShares.value=Math.abs(params.obj.quantity);
				params.tfc.updateValues();
			}
		};
	}
	
	function addProtection(t){
		return function(){
			self.clearActive();
			var componentName="enableBracket";
			for(var n=0;n<self.menu[componentName].nodes.length;n++){
				STX.appendClassName(self.menu[componentName].nodes[n], "active");
			}
			self.newTrade(componentName,{trade:t});
		};
	}

	function confirmVspTrade(t){
		return function(e){
			self.confirmVspTrade(t);
		};
	}

	function confirmCloseTrade(t,s){
		t.symbol=s;
		return function(e){
			if(!t.symbol) return;
			self.confirmCloseTrade(t);
		};
	}

	function confirmClosePosition(p,s){
		p.symbol=s;
		return function(e){
			e.stopPropagation();
			if(!p.symbol) return;
			self.confirmClosePosition(p);
		};
	}
	function update(){
		self.deriveOpenOrderMarkers();

		self.elements.currentCash.innerHTML=STX.money(self.account.balances.cash, 0, STX.convertCurrencyCode(self.account.currency));
		self.elements.currentFunds.innerHTML=STX.money(self.account.balances.buyingPower, 0, STX.convertCurrencyCode(self.account.currency));
		var position=self.account.positions[self.stx.chart.symbol];
		if(!position) position={quantity:0, basis:0};
		self.elements.currentPosition.innerHTML=STX.commas(position.quantity);

		// Build balances table
		$$$(".tfc-liquidity").innerHTML=STX.money(self.account.balances.liquidity, null, STX.convertCurrencyCode(self.account.currency));
		$$$(".tfc-unsettled-cash").innerHTML=STX.money(self.account.balances.unsettledCash, null, STX.convertCurrencyCode(self.account.currency));
		$$$(".tfc-cash").innerHTML=STX.money(self.account.balances.cash, null, STX.convertCurrencyCode(self.account.currency));
		if(self.account.balances.profitLoss){
			$$$(".tfc-profitloss").parentNode.style.display="";
			$$$(".tfc-profitloss").innerHTML=STX.money(self.account.balances.profitLoss, null, STX.convertCurrencyCode(self.account.currency));
		}else{
			$$$(".tfc-profitloss").parentNode.style.display="none";
		}
		$$$(".tfc-buying-power").innerHTML=STX.money(self.account.balances.buyingPower, null, STX.convertCurrencyCode(self.account.currency));

		// Build open orders table
		var table=$$$(".stx-current-orders tbody");
		STX.clearNode(table);
		var foundOne=false;
		var symbolList=[];
		//symbolList.push(self.stx.chart.symbol);
		var symbol;
		for(symbol in self.account.openOrders){
			/*if(symbol!=self.stx.chart.symbol)*/ symbolList.push(symbol);
		}
		var foundCurrentSymbol=false;
		var dividerDrawn=false;
		var lastWasOco=false;
		var contractSize, i, j;
		var tr, td, e;
		for(j=0;j<symbolList.length;j++){
			var price;
			symbol=symbolList[j];
			var openOrders=self.account.openOrders[symbol];
			if(!openOrders) continue;
			for(i=0;i<openOrders.length;i++){
				var openOrder=openOrders[i];
				foundOne=true;
				if((foundCurrentSymbol && symbol!=self.stx.chart.symbol) || 
					(!dividerDrawn && symbol==self.stx.chart.symbol)){
					if(j){
						tr=STX.newChild(table, "TR");
						tr.className="stx-divider";
						td=STX.newChild(tr, "TD");
						td.setAttribute("colspan","7");
						dividerDrawn=true;
					}
					foundCurrentSymbol=false;
				}
				tr=STX.newChild(table, "TR", "tfc-symbol");
				if(symbol==self.stx.chart.symbol){
					tr.className="tfc-current-symbol tfc-symbol";
					foundCurrentSymbol=true;
				}
				if(lastWasOco) tr.className="";
				tr.id="tfc-open-order-" + openOrder.id;
				if(lastWasOco){
					if(openOrder.action!=openOrders[i-1].action){
						STX.newChild(tr, "TD", null, openOrder.action.capitalize());
					}else{
						td=STX.newChild(tr, "TD");
					}
					td=STX.newChild(tr, "TD");
					td=STX.newChild(tr, "TD", "open-order-bracket-ind", "oco");
					e=td.insertBefore(document.createElement("I"),td.firstChild);
					STX.appendClassName(e,"fa fa-flip-vertical");
					e.appendChild(document.createTextNode("\u00a0"));
				}else{
					if(!openOrder.securityType || openOrder.securityType.toUpperCase()!="OPTION"){
						tr.addEventListener("tap", closure({symbol:symbol, tfc:self, type:"order", obj:openOrder}));
						//STX.safeClickTouch(tr, closure(symbol, self));
					}
					STX.newChild(tr, "TD", null, openOrder.action.capitalize());
					STX.newChild(tr, "TD", null, openOrder.quantity);
					STX.newChild(tr, "TD", null, symbol);
				}
				price=0;
				if(openOrder.limit){
					if(!openOrder.oco || (lastWasOco && openOrder.action!=openOrders[i-1].action) || (!lastWasOco && openOrder.id!=openOrder.oco && openOrder.action!=openOrders[i+1].action)){
						STX.newChild(tr, "TD", null, "@LMT");						
					}else{
						STX.newChild(tr, "TD", null, openOrder.quantity<0?"@SL":"@TP");
					}
					STX.newChild(tr, "TD", null, openOrder.limit);
					price=openOrder.limit;
				}else if(openOrder.stop){
					if(!openOrder.oco || (lastWasOco && openOrder.action!=openOrders[i-1].action) || (!lastWasOco && openOrder.id!=openOrder.oco && openOrder.action!=openOrders[i+1].action)){
						STX.newChild(tr, "TD", null, "@STP");						
					}else{
						STX.newChild(tr, "TD", null, openOrder.quantity<0?"@TP":"@SL");
					}
					STX.newChild(tr, "TD", null, openOrder.stop);
					price=openOrder.stop;
				}else if(openOrder.marketIfTouched){
					STX.newChild(tr, "TD", null, "@MIT");
					STX.newChild(tr, "TD", null, openOrder.marketIfTouched);
					price=openOrder.marketIfTouched;
				}else{
					STX.newChild(tr, "TD", null, "@MKT");
					STX.newChild(tr, "TD", null, "");
				}
				STX.newChild(tr, "TD", null, lastWasOco?"":openOrder.tif);
				if(price){
					contractSize=openOrder.contractSize?openOrder.contractSize:1;
					STX.newChild(tr, "TD", null, STX.money(price*openOrder.quantity*contractSize, null, STX.convertCurrencyCode(openOrder.currency)));
				}else{
					STX.newChild(tr, "TD", null, "");					
				}
				if(openOrder.oto instanceof Array){
					for(var oto=0;oto<openOrder.oto.length;oto++){
						tr=STX.newChild(table, "TR");
						tr.id="tfc-open-order-" + openOrder.id + "-oto-" + oto;
						td=STX.newChild(tr, "TD");
						td=STX.newChild(tr, "TD");
						td=STX.newChild(tr, "TD", "open-order-bracket-ind", "oto");
						e=td.insertBefore(document.createElement("I"),td.firstChild);
						STX.appendClassName(e,"fa fa-flip-vertical");
						e.appendChild(document.createTextNode("\u00a0"));
						price=0;
						if(openOrder.oto[oto].limit){
							STX.newChild(tr, "TD", null, openOrder.quantity<0?"@SL":"@TP");
							STX.newChild(tr, "TD", null, openOrder.oto[oto].limit);
							price=openOrder.oto[oto].limit;
						}else if(openOrder.oto[oto].stop){
							STX.newChild(tr, "TD", null, openOrder.quantity<0?"@TP":"@SL");
							STX.newChild(tr, "TD", null, openOrder.oto[oto].stop);
							price=openOrder.oto[oto].stop;
						}
						STX.newChild(tr, "TD");
						if(price){
							contractSize=openOrder.contractSize?openOrder.contractSize:1;
							STX.newChild(tr, "TD", null, STX.money(price*openOrder.quantity*contractSize, null, STX.convertCurrencyCode(openOrder.currency)));
						}else{
							STX.newChild(tr, "TD", null, "");					
						}
					}
				}
				if(openOrder.oco && openOrder.oco!=openOrder.id){  //assumes ocos are adjacent and are pairs
					lastWasOco=!lastWasOco;
				}

			}
		}
		if(!foundOne){
			STX.newChild(STX.newChild(table, "TR"), "TD", "tfc-not-found").appendChild(STX.translatableTextNode(self.stx,"No Open Orders"));
		}

		// Build positions table
		var viewType=self.positionsView;
		table=$$$(".stx-current-position tbody");
		STX.clearNode(table);
		foundOne=false;
		symbolList=[];
		//symbolList.push(self.stx.chart.symbol);
		for(symbol in self.account.positions){
			/*if(symbol!=self.stx.chart.symbol)*/ symbolList.push(symbol);
		}
		foundCurrentSymbol=false;
		currentSymbol="";
		var cumGL;
		for(j=0;j<symbolList.length;j++){
			var hedgedFields={};
			symbol=symbolList[j];
			position=self.account.positions[symbol];
			if(!position) continue;
			foundOne=true;
			var currency=STX.convertCurrencyCode(position.currency);
			if(foundCurrentSymbol || symbol==self.stx.chart.symbol){
				if(j){
					tr=STX.newChild(table, "TR");
					tr.className="stx-divider";
					td=STX.newChild(tr, "TD");
					td.setAttribute("colspan","5");
				}
				foundCurrentSymbol=false;
			}
			tr=STX.newChild(table, "TR");
			tr.id="tfc-position-" + symbol;
			if(!position.securityType || position.securityType.toUpperCase()!="OPTION")
				tr.addEventListener("tap", closure({symbol:symbol, tfc:self, type:"position", obj:position}));
			if(viewType=="lots"){
				tr.className="tfc-lots-position sym";
				td=STX.newChild(tr, "TD", null, symbol+(position.price?" @"+position.price:""));
				td.setAttribute("colspan",5);
			}else if(viewType=="maintenance"){
				tr.className="tfc-lots-position sym";
				td=STX.newChild(tr, "TD", null, symbol+(position.price?" @"+position.price:""));
				td.setAttribute("colspan",5);
				tr=STX.newChild(table, "TR");
				tr.className="tfc-lots-position";
				STX.newChild(tr, "TD", "tfc-col-qty", position.quantity.toString());
				STX.newChild(tr, "TD", null, position.basis?position.basis:"");
				td=STX.newChild(tr, "TD", "stx-btn click");
				td.appendChild(STX.translatableTextNode(self.stx,"Close Position"));
				if(position.quantity>0){
					if(position.basis<position.price) STX.appendClassName(td,"up");
					else if(position.basis>position.price) STX.appendClassName(td,"down");
				}else{
					if(position.basis>position.price) STX.appendClassName(td,"up");
					else if(position.basis<position.price) STX.appendClassName(td,"down");
				}
				td.addEventListener("tap", confirmClosePosition(position,symbol));
				td.setAttribute("colspan",3);
			}else{
				tr.className="tfc-position";
				STX.newChild(tr, "TD", null, symbol);
				contractSize=position.contractSize?position.contractSize:1;
				if(viewType=="performance"){
					if(position.basis){
						STX.newChild(tr, "TD", null, STX.money(position.quantity*position.basis*contractSize, 0, currency));
						STX.newChild(tr, "TD", null, STX.money(position.quantity*position.price*contractSize, 0, currency));
					}else{
						hedgedFields.cost=STX.newChild(tr, "TD", null, "N/A");  //repopulate below
						hedgedFields.value=STX.newChild(tr, "TD", null, "N/A");	//repopulate below			
					}
				}else{  //summary
					STX.newChild(tr, "TD", null, position.quantity.toString());
					STX.newChild(tr, "TD", null, position.basis?position.basis:"N/A");
				}
				//TODO, update position prices with quotes
				//STX.newChild(tr, "TD", null, STX.money(position.price * position.quantity * contractSize, null, STX.convertCurrencyCode(position.currency));
				if(position.basis){
					STX.newChild(tr, "TD", null, STX.money((position.price-position.basis) * position.quantity * contractSize, (viewType=="performance"?0:null), currency));
					cumGL=(position.price-position.basis)/position.basis*100;
					if(position.quantity<0) cumGL*=-1;
					cumGL=cumGL.toFixed(2);
					if(cumGL>0) cumGL="+" + cumGL;
					STX.newChild(tr, "TD", null, cumGL + "%");
				}else{
					hedgedFields.gainloss=STX.newChild(tr, "TD", null, "N/A");  //repopulate below
					hedgedFields.pctGainloss=STX.newChild(tr, "TD", null, "N/A"); //repopulate below				
				}
	
				/*var todaysGL=(position.price-position.prevClose)/position.prevClose*100;
				todaysGL=todaysGL.toFixed(2) + "%";
				if(todaysGL>0) todaysGL="+" + todaysGL;
				STX.newChild(tr, "TD", null, todaysGL);*/
			}
			if(symbol==self.stx.chart.symbol){
				STX.appendClassName(tr,"tfc-current-symbol");
				foundCurrentSymbol=true;
				currentSymbol=symbol;
			}
			if(self.account.trades[symbol]){
				var sumBasis=0;
				var sumValue=0;
				for(var t=0;t<self.account.trades[symbol].length;t++){
					var trade=self.account.trades[symbol][t];
					sumBasis+=(trade.basis * trade.quantity * contractSize);
					sumValue+=(trade.price * trade.quantity * contractSize);
					if(viewType=="lots" || viewType=="maintenance"){
						tr=STX.newChild(table, "TR");
						tr.className="tfc-current-trades";
						if(viewType=="lots") {
							td=STX.newChild(tr, "TD", "tfc-trade-date", STX.yyyymmdd(new Date(trade.time)));
						}
						td=STX.newChild(tr, "TD", "tfc-col-qty stx-btn click", trade.quantity);
						if(viewType=="maintenance" && self.account.config.vsp=="M" && symbol==self.stx.chart.symbol){
							td.addEventListener("tap", confirmVspTrade(trade));
						}else{
							STX.unappendClassName(td,"stx-btn");
							STX.unappendClassName(td,"click");
						}
						STX.newChild(tr, "TD", null, trade.basis);
						if(viewType=="lots"){
							contractSize=trade.contractSize?trade.contractSize:1;
							STX.newChild(tr, "TD", null, STX.money((trade.price-trade.basis) * trade.quantity * contractSize, null, STX.convertCurrencyCode(trade.currency)));
							cumGL=(trade.price-trade.basis)/trade.basis*100;
							if(trade.quantity<0) cumGL*=-1;
							cumGL=cumGL.toFixed(2) + "%";
							if(cumGL>0) cumGL="+" + cumGL;
							STX.newChild(tr, "TD", null, cumGL);
						}
						if(viewType=="maintenance"){
							td=STX.newChild(tr, "TD", "stx-btn click tfc-trade-actions");
							var protection=false;
							if(trade.protect){
								if(trade.protect.limit) {
									var tp=STX.newChild(td, "SPAN", null, "\u00a0@TP\u00a0"+trade.protect.limit);
									tp.style.color="green";
									protection=true;
								}
								if(trade.protect.stop) {
									var sl=STX.newChild(td, "SPAN", null, "\u00a0@SL\u00a0"+trade.protect.stop);
									sl.style.color="red";
									protection=true;
								}
							}
							if(!protection) {
								if(symbol==self.stx.chart.symbol){
									STX.newChild(td, "SPAN", null).appendChild(STX.translatableTextNode(self.stx,"Add Protection"));
									//td.appendChild(document.createTextNode(self.stx.translateIf("Add Protection")));
								}else{
									td.className="tfc-trade-actions";
									STX.newChild(td, "SPAN", null).appendChild(STX.translatableTextNode(self.stx,"No Protection"));
									//td.appendChild(document.createTextNode(self.stx.translateIf("No Protection")));
								}
							}
							td.setAttribute("colspan",2);
							if(symbol==self.stx.chart.symbol){
								td.addEventListener("tap", addProtection(trade));
							}else{
								STX.unappendClassName(td,"stx-btn");
								STX.unappendClassName(td,"click");
							}
							td=STX.newChild(tr, "TD", "stx-btn click");
							td.appendChild(STX.translatableTextNode(self.stx,"Close"));
							if(trade.quantity>0){
								if(trade.basis<trade.price) STX.appendClassName(td,"up");
								else if(trade.basis>trade.price) STX.appendClassName(td,"down");
							}else{
								if(trade.basis>trade.price) STX.appendClassName(td,"up");
								else if(trade.basis<trade.price) STX.appendClassName(td,"down");								
							}
							td.addEventListener("tap", confirmCloseTrade(trade,symbol));
						}
					}
					if(hedgedFields.cost) hedgedFields.cost.innerHTML=STX.money(sumBasis, null, STX.convertCurrencyCode(trade.currency));
					if(hedgedFields.value) hedgedFields.value.innerHTML=STX.money(sumValue, null, STX.convertCurrencyCode(trade.currency));
					if(hedgedFields.gainloss) hedgedFields.gainloss.innerHTML=STX.money(sumValue-sumBasis, (viewType=="performance"?0:null), currency);
					if(hedgedFields.pctGainloss){
						cumGL=(sumValue-sumBasis)/sumBasis*100;
						if(position.quantity<0) cumGL*=-1;
						cumGL=cumGL.toFixed(2);
						if(cumGL>0) cumGL="+" + cumGL;
						hedgedFields.pctGainloss.innerHTML=cumGL + "%";
					}

				}
			}
		}

		if(!foundOne){
			tr=STX.newChild(table, "TR");
			td=STX.newChild(tr, "TD", "tfc-not-found");
			td.appendChild(STX.translatableTextNode(self.stx,"No Positions"));
			//td.setAttribute("colspan", 5);
			self.elements.closeAllPositions.style.display="none";
			$$$(".stx-trade-positions .tfc-positions-view.holder").style.display="none";
			$$$(".stx-trade-positions thead").style.display="none";
		}else{
			if(self.account.config.closeAll) self.elements.closeAllPositions.style.display="";
			$$$(".stx-trade-positions .tfc-positions-view.holder").style.display="";
			$$$(".stx-trade-positions thead").style.display="";
			$$$(".stx-trade-positions .tfc-positions-view.lots").style.display="none";
			for(var tt in self.account.trades){
				$$$(".stx-trade-positions .tfc-positions-view.lots").style.display="";
				break;
			}
		}
		if(self.account.config.tradeActions) {
			self.elements.positionsViewMaintenance.style.display="";
		}else{
			self.elements.positionsViewMaintenance.style.display="none";
		}
		self.refreshScrollWindows();
		self.configureMenu(); // menu options may have changed if a position has recently opened or closed

	}
	update();	// first update with the data that we already have

	function cb(fetched){
		return function(){
			fetched.fetched++;
			if(fetched.fetched<4) return;
			update();
		};
	}
	// then fetch fresh data, and we'll update again when it comes in
	this.account.fetchBalances(cb(fetched));
	this.account.fetchTrades(cb(fetched));
	this.account.fetchPositions(cb(fetched));
	this.account.fetchOpenOrders(cb(fetched));
};

/**
 * Refreshes the iscroll mechanism for the positions and open orders widgets in the expanded panel.
 */
STX.TFC.prototype.refreshScrollWindows=function(openOrderTop){
	var positionWrapper=$$$(".stx-current-position tbody").parentNode.parentNode;
	var openOrderWrapper=$$$(".stx-current-orders tbody").parentNode.parentNode;
	var totalHeight=positionWrapper.parentNode.parentNode.clientHeight-positionWrapper.parentNode.offsetTop-30; // a little extra just to try and avoid overlapping the condense/expand toggle
	var positionHeight, openOrderHeight;
	// adjust if we turned off positions because the space is too small
	if ($$$(".stx-trade-positions").style.display == 'none') totalHeight -= 172;
	var positionCount=0, openOrderCount=0;
	if(!this.account) return;
	var symbol;
	for(symbol in this.account.positions){
		positionCount++;
	}
	for(symbol in this.account.openOrders){
		var openOrder=this.account.openOrders[symbol];
		for(var i=0;i<openOrder.length;i++){
			openOrderCount++;
		}
	}
	if(!openOrderTop) openOrderTop=this.elements.openOrdersHeader.resizedTop;
	if(openOrderTop){
		openOrderHeight=Math.ceil(totalHeight+positionWrapper.parentNode.offsetTop-openOrderTop);
		positionHeight=totalHeight-openOrderHeight;
	}else{
		var ratio=positionCount/(positionCount+openOrderCount);
		positionHeight=Math.ceil(totalHeight*ratio);
		// minimum sizes if positions or open orders in either
		if(positionHeight<totalHeight*0.5 && positionCount>0){
			positionHeight=Math.round(totalHeight*0.5);
		}else if(positionHeight>totalHeight*0.5 && openOrderCount>0){
			positionHeight=Math.round(totalHeight*0.5);
		}
		openOrderHeight=totalHeight-positionHeight;
		// if the positions are off, give the open order the extra room those headers were taking
		if ($$$(".stx-trade-positions").style.display == 'none') openOrderHeight=totalHeight;
	}
	// minimum size when no orders or screens is too small
	if(openOrderHeight<60){
		openOrderHeight=60;
		positionHeight=totalHeight-openOrderHeight;
	}	
	// minimum size when no positions or screens is too small
	if(!positionCount || positionHeight<60){
		positionHeight=60;
		openOrderHeight=totalHeight-positionHeight;
		STX.appendClassName(this.elements.openOrdersHeader,"no-resize");
// disable the hiding of Positions section when no positions or screen small, so we can see the "Close All" button
/*		$$$(".stx-trade-positions").style.display="none";

	} else {
		$$$(".stx-trade-positions").style.display="";*/
	}else{
		STX.unappendClassName(this.elements.openOrdersHeader,"no-resize");		
	}
	positionWrapper.style.height=(positionHeight - positionWrapper.offsetTop) + "px";
	openOrderWrapper.style.height=(openOrderHeight - openOrderWrapper.offsetTop) + "px";
	if(this.positionIScroll===null){
		this.positionIScroll=STX.iscroll.newScroller(positionWrapper, {tap:true, scrollbars: true, interactiveScrollbars: true,version: "IScroll5"});
	}else{
		this.positionIScroll.refresh();
	}
	if(this.openOrderIScroll===null){
		this.openOrderIScroll=STX.iscroll.newScroller(openOrderWrapper, {tap:true, scrollbars: true, interactiveScrollbars: true, version: "IScroll5"});
	}else{
		this.openOrderIScroll.refresh();
	}
};
/**
 * The TFC menu is dynamic based on whether the account contains a current position for the enables security, and whether that position is
 * long or short. This method configures the menu as such by looking at the account's current position for the enabled security.
 */
STX.TFC.prototype.configureMenu=function(){
	var self=this;
	if(!this.account){
		setDisplay(self.menu.enableBuy.nodes, "none");
		setDisplay(self.menu.enableSell.nodes, "none");
		setDisplay(self.menu.enableShort.nodes, "none");
		setDisplay(self.menu.enableCover.nodes, "none");
		setDisplay(self.menu.enableStraddle.nodes, "none");
		setDisplay(self.menu.enableStrangle.nodes, "none");
		setDisplay(self.menu.enableBracket.nodes, "none");
		return;	// no account enabled then trading not enabled
	}
	function setDisplay(nodes, value){
		for(var i=0;i<nodes.length;i++){
			nodes[i].style.display=value;
		}
	}
	var symbol=self.stx.chart.symbol;
	this.account.tradability(symbol, function(tradability){
		self.tradability=tradability;
		if(!symbol) tradability.tradable=false; // make sure cannot trade when no security enabled

		var position=self.account.positions[symbol];
		var hasShort=position && position.quantity<0;
		var hasLong=position && position.quantity>0;
		//hedging check
		var trades=self.account.trades[symbol];
		for(var t=0;trades && t<trades.length;t++){
			if(trades[t].quantity<0) hasShort=true; else hasLong=true;
		}
		//unbound open order check
		if(self.account.config.reducePosition===false){
			var orders=self.account.openOrders[symbol];
			for(var o=0;orders && o<orders.length;o++){
				if(orders[o].vspId || orders[o].oto) continue;
				if(orders[o].action.toLowerCase()=="sell" || orders[o].action.toLowerCase()=="short") hasShort=true;
				else if(orders[o].action.toLowerCase()=="buy" || orders[o].action.toLowerCase()=="cover") hasLong=true;
			}
		}

		setDisplay(self.menu.enableBuy.nodes, "none");
		setDisplay(self.menu.enableSell.nodes, "none");
		setDisplay(self.menu.enableShort.nodes, "none");
		setDisplay(self.menu.enableCover.nodes, "none");
		setDisplay(self.menu.enableStraddle.nodes, "none");
		setDisplay(self.menu.enableStrangle.nodes, "none");
		setDisplay(self.menu.enableBracket.nodes, "none");
		var i, tradeElementName;
		if(!tradability.tradable || !tradability.marketable){
			setDisplay(self.menu.enableMarket.nodes, "none");
			// hide market order widget if not tradable security
			for(i=0;i<self.menu.enableMarket.dom.length;i++){
				tradeElementName=self.menu.enableMarket.dom[i];
				self.dom[tradeElementName].style.display="none";
			}
			if(!tradability.tradable) return;
		}else{
			setDisplay(self.menu.enableMarket.nodes, "");
			// show market order widget if tradable security and the menu is still active 
			if(!self.modifyingOrder && self.menu.enableMarket.nodes[0].className.indexOf("active")!=-1){
				for(i=0;i<self.menu.enableMarket.dom.length;i++){
					tradeElementName=self.menu.enableMarket.dom[i];
					self.dom[tradeElementName].style.display="";
				}
			}
			STX.unappendClassName(self.elements.marketBuy,"disabled");
			STX.unappendClassName(self.elements.marketSell,"disabled");
			if(!self.account.config.hedging && self.account.config.reducePosition===false){
				if(hasShort) STX.appendClassName(self.elements.marketBuy,"disabled");
				if(hasLong) STX.appendClassName(self.elements.marketSell,"disabled");
		}
		}
		if(!hasLong && !hasShort){
			setDisplay(self.menu.enableBuy.nodes, "");
			setDisplay(self.menu.enableShort.nodes, "");
			if(self.account.config.oco){
				setDisplay(self.menu.enableStraddle.nodes, "");
				setDisplay(self.menu.enableStrangle.nodes, "");
			}
		}else{
			if(self.account.config.hedging){
				setDisplay(self.menu.enableBuy.nodes, "");
				setDisplay(self.menu.enableShort.nodes, "");
				if(self.account.config.reducePosition!==false){
					if(hasShort) setDisplay(self.menu.enableCover.nodes, "");
					if(hasLong) setDisplay(self.menu.enableSell.nodes, "");		
				}
			}else{
				if(hasShort && !hasLong){
					setDisplay(self.menu.enableShort.nodes, "");
					if(self.account.config.reducePosition!==false) setDisplay(self.menu.enableCover.nodes, "");
				}else if(!hasShort && hasLong){
				setDisplay(self.menu.enableBuy.nodes, "");
					if(self.account.config.reducePosition!==false) setDisplay(self.menu.enableSell.nodes, "");
				}
			}
			if(self.account.config.oco){
				setDisplay(self.menu.enableBracket.nodes, "");
			}
		}
		if(!tradability.shortable){
			setDisplay(self.menu.enableShort.nodes, "none");
			setDisplay(self.menu.enableStraddle.nodes, "none");
			setDisplay(self.menu.enableStrangle.nodes, "none");
		}
	});
};

/**
 * Opens Trade From Chart. The menu is configured for the current security and open orders are retrieved and displayed.
 */
STX.TFC.prototype.openTFC=function(){
	if(!this.account) return;
	this.crosshairsOriginallyOn=this.stx.layout.crosshair;
	if(!this.positionsView) this.positionsView="summary";
	this.configureMenu();
	this.updateData();
};



/**
 * Closes Trade From Chart. Any active trading elements are hidden. The chart itself is scrolled back to its initial margins.
 * Open orders remain displayed.
 */
STX.TFC.prototype.closeTFC=function(){
	STX.hideKeyboard();
	STX.fixScreen();
	this.modifyingOrder=null;	// allow open order markets to display
	this.stx.layout.crosshair=this.crosshairsOriginallyOn;
	this.activeTrade=null;
	this.clearActive();
	this.hideAllDOM();
	if(STX.hasClassName($$$(".stx-trade-panel"), "closed")){
		 if(!this.account || !this.account.config.showOpenOrdersWhenTFCClosed) this.clearEphemeral("openOrders"); // remove open orders	
	}
	this.stx.resizeChart();
	var wsInTicks=Math.round(this.stx.preferences.whitespace/this.stx.layout.candleWidth);
	this.stx.chart.scroll=this.stx.chart.maxTicks-wsInTicks;
	if(this.stx.displayInitialized) this.stx.draw();
	//this.updateData();
};

/**
 * Creates a new trade of the requested type. Crosshairs are automatically turned off, but the prior crosshair state is remembered for when TFC
 * is closed. The chart is scrolled left in order to make room for the TFC widgets.
 * @param  {string} componentName The component to enable (i.e. "enableMarket")
 * @param  {object} [params]        If the result of the user clicking on an open order marker to modify, then the open order will be passed in the params.
 */
STX.TFC.prototype.newTrade=function(componentName, params){
	if(!params || !params.openOrder){
		this.modifyingOrder=null;	// allow open order markets to display
		STX.unappendClassName(this.dom.limitOrder, "tfc-cancel");
		this.elements.limitCurrency.readOnly=false;
		this.elements.limitShares.readOnly=false;
	}
	this.hideAllDOM();
	var which=this.menu[componentName];
	var dom=which.dom;
	for(var i=0;i<dom.length;i++){
		var tradeElementName=dom[i];
		this.dom[tradeElementName].style.display="";
	}
	this.crosshairsOriginallyOn=this.stx.layout.crosshair;
	this.stx.layout.crosshair=false;
	this[componentName](params);	// run initialize function
	this.stx.resizeChart();
	// Adjust the chart space to make room for trading components, except market orders
	if(componentName!="enableMarket"){
		var wsInTicks=Math.round(this.width/this.stx.layout.candleWidth);
		this.stx.chart.scroll=this.stx.chart.maxTicks-wsInTicks;
		this.stx.draw();
	}
	this.updateValues();
};

/**
 * Clears out the "active" class from menu items, so that they no longer have active styling. Also clears the share and currency input boxes.
 * Any existing trading UI elements will be closed except for the market order widget which will remain open.
 */
STX.TFC.prototype.clearActive=function(){
	for(var componentName in this.menu){
		var components=this.menu[componentName].nodes;
		for(var i=0;i<components.length;i++){
			STX.unappendClassName(components[i], "active");
		}
	}
	this.elements.marketShares.value="";
	this.elements.marketCurrency.value="";
	this.elements.marketLossBracketDifferential.value="";
	this.elements.marketProfitBracketDifferential.value="";
	this.elements.limitShares.value="";
	this.elements.limitCurrency.value="";
	this.elements.ocoCurrency.value="";
	STX.unappendClassName(this.dom.otoAbove, "bracket");
	STX.unappendClassName(this.dom.otoBelow, "bracket");
};

/**
 * Places an order or modification. Defers to the current brokerage Account object. When the order is placed the widgets are cleared out
 * unless the user is trading with market orders in which case the widget remains in place.
 * @param  {object} order The order to place
 */
STX.TFC.prototype.placeOrder=function(order){
	var self=this;
	function finishCloseTrade(err){
		STX.DialogManager.dismissDialog();
		if(err) STX.alert(err);
		self.updateData();
		self.stx.draw();
	}
	if(order.type=="close"){
		var trades=this.account.trades[order.symbol];
		if(trades && order.id){
			for(var t=0;t<trades.length;t++){
				if(trades[t].id==order.id){
					trades[t].symbol=order.symbol;
					this.account.closeTrade(this, trades[t], finishCloseTrade);
					break;
				}
			}
		}else{
			var position=this.account.positions[order.symbol];
			var err="No matching position found.";
			if(position){
				position.symbol=order.symbol;
				var quantity=position.quantity;
				if(Math.abs(position.quantity)==Math.abs(order.quantity)){
					this.account.closePosition(this, position, finishCloseTrade);	
					err=null;
				}
			}
			if(err) finishCloseTrade(err);
		}
	}else if(order.type=="replace"){
		this.account.replaceOrder(this, order, function(err, obj){
			STX.DialogManager.dismissDialog();
			if(err){
				STX.alert(err);
			}
			// temporarily modify the order in our open orders. updateData should refresh from what is at the brokerage.
			if(obj && obj.id){
				var symbol=self.stx.chart.symbol;
				var openOrders=self.account.openOrders[symbol];
				for(var i=0;i<openOrders.length;i++){
					var openOrder=openOrders[i];
					if(openOrder.id==order.id){
						openOrder.id=obj.id;
						if(order.limit["new"]) openOrder.limit=order.limit["new"];
						else delete openOrder.limit;
						if(order.stop["new"]) openOrder.stop=order.stop["new"];
						else delete openOrder.stop;
						if(order.marketIfTouched["new"]) openOrder.marketIfTouched=order.marketIfTouched["new"];
						else delete openOrder.marketIfTouched;
						if(order.quantity["new"]) openOrder.quantity=order.quantity["new"];
					}
				}
				self.deriveOpenOrderMarkers();
			}
			self.updateData();
			self.closeTFC();
			self.stx.draw();
		});
	}else if(order instanceof Array && order[0].tradeid){
		this.account.setProtection(this, order, function(err, obj){
			STX.DialogManager.dismissDialog();
			if(err){
				STX.alert(err);
			}
			// temporarily add the order to our open orders. updateData should refresh from what is at the brokerage.
			if(obj && obj.id){
				var symbol=self.stx.chart.symbol;
				var trades=self.account.trades[symbol];
				for(var i=0;i<trades.length;i++){
					var trade=trades[i];
					if(trade.id==order[0].tradeid){
						trade.protect={};
						for(var n=0;n<order.length;n++){
							if(order[n].limit) trade.protect.limit=order[n].limit;
							if(order[n].stop) trade.protect.stop=order[n].stop;
						}
					}
				}
				var openOrders=self.account.openOrders[symbol];
				if(!openOrders) openOrders=self.account.openOrders[symbol]=[];
				var tradeNum=0;
				for(i=0;i<openOrders.length;i++){
					var openOrder=openOrders[i];
					if(openOrder.tradeid==order[0].tradeid){
						if(order.length==1) {
							if(tradeNum) {
								openOrders.splice(i,1);
								break;
							}else{
								openOrder.oco=null;
							}
						}
						openOrder.id=obj.id[tradeNum];
						if(order.length>1) openOrder.oco=obj.id[1-tradeNum];
						else openOrder.oco=openOrder.id;
						openOrder.limit=openOrder.stop=null;
						if(order[tradeNum].limit) openOrder.limit=order[tradeNum].limit;
						if(order[tradeNum].stop) openOrder.stop=order[tradeNum].stop;
						tradeNum++;
					}
				}
				for(;tradeNum<order.length;tradeNum++){
					order[tradeNum].id=obj.id[tradeNum];
					if(order.length>1) order[tradeNum].oco=obj.id[1-tradeNum];
					else order[tradeNum].oco=order[tradeNum].id;
					openOrders.push(order[tradeNum]);
				}
				self.deriveOpenOrderMarkers();
			}
			self.updateData();
			if(self.activeTrade!="market") self.closeTFC();
			self.stx.draw();
		});
	}else{
		this.account.placeOrder(this, order, function(err, obj){
			STX.DialogManager.dismissDialog();
			if(err){
				STX.alert(err);
			}
			// temporarily add the order to our open orders. updateData should refresh from what is at the brokerage.
			if(obj && obj.id){
				order.id=obj.id;
				var symbol=self.stx.chart.symbol;
				var openOrders=self.account.openOrders[symbol];
				if(!openOrders) openOrders=self.account.openOrders[symbol]=[];
				openOrders.push(order);
				self.deriveOpenOrderMarkers();
			}
			self.updateData();
			if(self.activeTrade!="market") self.closeTFC();
			self.stx.draw();
		});
	}
};

/**
 * Places a cancel request for the current open order. Cancel requests are deferred through the brokerage Account object.
 */
STX.TFC.prototype.cancelOpenOrder=function(){
	var order=this.modifyingOrder;
	var self=this;
	this.modalEnd();
	function processCancel(self,order,err){
		if(err){
			STX.alert(err);
		}
		order.cancelled=true; // hide the order, since it should be cancelled now. Ideally updateData clears it out but that has some latency
		self.updateData();
		self.closeTFC();
		self.stx.draw();
	}
	if(self.config.skipConfirms){
		self.account.cancelOrder(self, order, function(err){
			processCancel(self,order,err);
		});
		return;
	}
	STX.unappendClassName($$$("#tfcConfirmOrder"), "tfc-pending");
	$$$("#tfcConfirmOrder .processOrder").style.display="block";
	$$$("#tfcConfirmOrder .orderProcessed").style.display="none";
	this.account.confirmOrder(this, order, function(confirmation){
		STX.DialogManager.displayDialog('tfcConfirmOrder');
		var descriptionNode=$$$("#tfcConfirmOrder .tfcOrderDescription");
		var priceNode=$$$("#tfcConfirmOrder .tfcOrderPrice");
		var tifNode=$$$("#tfcConfirmOrder .tfcOrderTif");
		var otoNode=$$$("#tfcConfirmOrder .tfc-confirm-oto");
		var basisNode=$$$("#tfcConfirmOrder .tfc-confirm-basis");
		var estPlNode=$$$("#tfcConfirmOrder .tfc-confirm-pl");
		basisNode.style.display="none";
		estPlNode.style.display="none";

		var actionText="CANCEL "+order.action.capitalize();
		if(order.quantity<=0) {
			if(order.action=="sell") actionText+=" (short)";
			else actionText+=" (to cover)";
		}
		var description=actionText + " " + STX.commas(order.quantity);
		if(!self.account.tradesLikeForex(self.stx.chart.symbol)){
			description+=" shares of";
		}
		description+=" " + self.stx.chart.symbol;
		descriptionNode.innerHTML=description.capitalize();

		var price="@ ";
		if(order.limit) price+=self.formatPrice(order.limit);
		if(order.stop) price+=self.formatPrice(order.stop) + " Stop";
		if(order.marketIfTouched) price+=self.formatPrice(order.marketIfTouched) + " MIT";
		if(!order.limit && !order.stop && !order.marketIfTouched) price+="MKT";

		priceNode.innerHTML=price;

		tifNode.innerHTML="";
		if(order.tif=="DAY") tifNode.appendChild(STX.translatableTextNode(self.stx,"Day Order"));
		else if(order.tif=="GTC") tifNode.appendChild(STX.translatableTextNode(self.stx,"Good Until Cancelled"));

		if(order.oto){
			otoNode.style.display="";
			$$$("#tfcConfirmOrder .tfcOrderOTO").innerHTML=self.printableOTO(order.oto);
		}else{
			otoNode.style.display="none";		
		}

		var submitButton=$$$("#tfcConfirmOrder .tfcSubmit");
		var abandonButton=$$$("#tfcConfirmOrder .tfcAbandon");
		function closure(self, order, submitButton){
			return function(){
				STX.clearSafeClickTouches(submitButton);
				STX.clearSafeClickTouches(abandonButton);
				$$$("#tfcConfirmOrder .processOrder").style.display="block";
				STX.appendClassName($$$("#tfcConfirmOrder"), "tfc-pending");
				self.account.cancelOrder(self, order, function(err){
					STX.DialogManager.dismissDialog();
					processCancel(self,order,err);
				});
			};
		}
		STX.safeClickTouch(abandonButton, STX.DialogManager.dismissDialog);
		var i, div;
		if(confirmation && confirmation.errors){
			submitButton.style.display="none";
			for(i=0;i<confirmation.errors.length;i++){
				div=STX.newChild($$$("#tfcConfirmOrder .tfc-errors"), "div", null, confirmation.errors[i]);
			}
		}else{
			STX.clearNode($$$("#tfcConfirmOrder .tfc-errors"));
			submitButton.style.display="";
			STX.safeClickTouch(submitButton, closure(self, order, submitButton));
		}
		if(confirmation && confirmation.warnings){
			for(i=0;i<confirmation.warnings.length;i++){
				div=STX.newChild($$$("#tfcConfirmOrder .tfc-warnings"), "div", null, confirmation.warnings[i]);
			}
		}else{
			STX.clearNode($$$("#tfcConfirmOrder .tfc-warnings"));
		}
		$$$("#tfcConfirmOrder .processOrder").style.display="none";
		$$$("#tfcConfirmOrder .orderProcessed").style.display="block";
	});
};

/**
 * Creates an OCO order from the position and input values in the GUI. The OCO is an array consisting of two orders. This format
 * can be received by the order interface in STX.Account.
 * @return {array}        A tuple containing the two orders
 */
STX.TFC.prototype.createOCOFromGUI=function(){
	var order={}, order2={};
	order.symbol=this.stx.chart.symbol;
	order2.symbol=this.stx.chart.symbol;
	if(this.activeTrade=="strangle"){
		// use innerHTML not because we're lazy but to ensure quantity matches what user is seeing on screen
		order.quantity=this.quantityFromValue(this.elements.ocoAboveShares.innerHTML);
		order2.quantity=this.quantityFromValue(this.elements.ocoBelowShares.innerHTML);
		order.action="sell";
		order.limit=parseFloat(this.elements.dragLineAbovePrice.innerHTML);
		order2.action="buy";
		order2.limit=parseFloat(this.elements.dragLineBelowPrice.innerHTML);
		order.tif=this.elements.ocoTIF.value;
		order2.tif=this.elements.ocoTIF.value;
	}else if(this.activeTrade=="straddle"){
		order.quantity=this.quantityFromValue(this.elements.ocoAboveShares.innerHTML);
		order2.quantity=this.quantityFromValue(this.elements.ocoBelowShares.innerHTML);
		order.action="buy";
		order.stop=parseFloat(this.elements.dragLineAbovePrice.innerHTML);
		order2.action="sell";
		order2.stop=parseFloat(this.elements.dragLineBelowPrice.innerHTML);
		order.tif=this.elements.ocoTIF.value;
		order2.tif=this.elements.ocoTIF.value;
	}else if(this.activeTrade=="bracket_cover" || this.activeTrade=="short"){
		order.quantity=this.quantityFromValue(this.elements.limitShares.value);
		order2.quantity=order.quantity;
		order.action="cover";
		order.stop=parseFloat(this.elements.dragLineAbovePrice.innerHTML);
		order2.action="cover";
		order2.limit=parseFloat(this.elements.dragLineBelowPrice.innerHTML);
		order.tif=this.elements.limitTIF.value;
		order2.tif=this.elements.limitTIF.value;
		if(this.elements.bracketId.value){
			order.tradeid=this.elements.bracketId.value;
			order2.tradeid=this.elements.bracketId.value;
		}
	}else if(this.activeTrade=="bracket_sell" || this.activeTrade=="buy"){
		order.quantity=this.quantityFromValue(this.elements.limitShares.value);
		order2.quantity=order.quantity;
		order.action="sell";
		order.limit=parseFloat(this.elements.dragLineAbovePrice.innerHTML);
		order2.action="sell";
		order2.stop=parseFloat(this.elements.dragLineBelowPrice.innerHTML);
		order.tif=this.elements.limitTIF.value;
		order2.tif=this.elements.limitTIF.value;
		if(this.elements.bracketId.value){
			order.tradeid=this.elements.bracketId.value;
			order2.tradeid=this.elements.bracketId.value;
		}
	}
	order.oco=true;
	order2.oco=true;
	
	var arr=[];
	if(this.activeTrade=="straddle" || this.activeTrade=="strangle" || this.dom.otoAbove.style.display!="none") 
		arr.push(order);
	if(this.activeTrade=="straddle" || this.activeTrade=="strangle" || this.dom.otoBelow.style.display!="none") 
		arr.push(order2);
	return arr;
};

/**
 * Returns a quantity given a string value which may contain commas.
 * @param  {string} value Value from an input box
 * @return {number}       A valid quantity, float
 */
STX.TFC.prototype.quantityFromValue=function(value){
	var quantity=parseFloat(value.replace(/,/g,""));
	if(isNaN(quantity)) quantity=0;
	return quantity;
};

/**
 * Creates an order from the positioning and input values of the GUI elements. The order will be in a format that can be placed
 * through the STX.Account interface. This will include OTO orders, but not OCO orders which are created in STX.TFC.prototype.createOCOFromGUI.
 * @param  {string} action The order type ("limit_buy","limit_sell","limit_short","limit_cover")
 * @return {object}        The order
 */
STX.TFC.prototype.createOrderFromGUI=function(action){
	var actionMap={
		"market_buy": "buy",
		"market_sell": "sell",
		"limit_buy": "buy",
		"limit_sell": "sell",
		"limit_short": "short",
		"limit_cover": "cover",
		"OCO": "OCO"
	};
	var order={};
	order.type="order";
	order.symbol=this.stx.chart.symbol;
	order.action=actionMap[action];
	if(action=="limit_buy" || action=="limit_sell" || action=="limit_short" || action=="limit_cover"){
		order.quantity=this.quantityFromValue(this.elements.limitShares.value);
		order.tif=this.elements.limitTIF.value;
		var currentPrice=this.getCurrentPriceForOrder(order.action);
		var centerPrice=parseFloat(this.elements.dragLineCenterPrice.innerHTML);
		if(!this.limitFlippedToMarket){
			if(order.action=="buy" || order.action=="cover"){
				if(centerPrice<=currentPrice) order.limit=centerPrice;
				else order.stop=centerPrice;
			}else{
				if(centerPrice>=currentPrice) order.limit=centerPrice;
				else order.stop=centerPrice;
			}
		}
	}else if(action=="market_buy" || action=="market_sell"){
		if((action=="market_buy" && STX.hasClassName(this.elements.marketBuy,"disabled")) ||
			(action=="market_sell" && STX.hasClassName(this.elements.marketSell,"disabled"))){
			order.type="";
			return;
		}
		var currentQuote=this.stx.currentQuote();
		var bid=currentQuote.Bid?currentQuote.Bid:currentQuote.Close;
		var ask=currentQuote.Ask?currentQuote.Ask:currentQuote.Close;
		order.quantity=this.quantityFromValue(this.elements.marketShares.value);
		order.tif="DAY";
		if(this.account.config.oto){
			order.oto=[];
			var oco={};
			oco.symbol=this.stx.chart.symbol;
			oco.quantity=this.quantityFromValue(this.elements.marketShares.value);
			oco.oco=true;
			oco.tif="GTC";
			if(action=="market_buy") oco.action="sell";
			else oco.action="buy";
			var decimalPlaces=0;
			var isForex=false;
			if(this.account.isForex(this.stx.chart.symbol)){
				isForex=true;
				if(this.stx.chart.symbol.match(/(\^JPY.{3}|\^.{3}JPY)/)) decimalPlaces=2;
				else decimalPlaces=4;
			}
			var loss=Number(this.elements.marketLossBracketDifferential.value)/Math.pow(10,decimalPlaces);
			var profit=Number(this.elements.marketProfitBracketDifferential.value)/Math.pow(10,decimalPlaces);
			if(loss>0){
				order.oto.unshift(STX.shallowClone(oco));
				if(oco.action=="sell") order.oto[0].stop=bid-loss;
				else order.oto[0].stop=ask+loss;
			}
			if(profit>0){
				order.oto.unshift(STX.shallowClone(oco));
				if(oco.action=="sell") order.oto[0].limit=bid+profit;
				else order.oto[0].limit=ask-profit;
			}
			if(order.oto.length===0) order.oto=null;
		}
	}
	// If either below or above lines are displayed then we create an oto
	if(this.dom.otoAbove.style.display!="none" || this.dom.otoBelow.style.display!="none"){
		var oto=this.createOCOFromGUI();					// re-use existing code to create OCO
		if (oto[0]) oto[0].tif="GTC";
		if (oto[1]) oto[1].tif="GTC";
		order.oto=oto;
	}

	return order;
};

/**
 * Creates a replace order from the positioning and input values of the GUI elements. The order will be in a format that can be placed
 * through the STX.Account interface. This will include OTO orders. The format for replace orders is to create a an object for each
 * order parameter that includes a "old" and "new" value.
 * @return {object}        The order
 */
STX.TFC.prototype.createReplaceFromGUI=function(){
	var order={
		type:"replace",
		symbol:"",
		action:"",
		limit: {},
		stop: {},
		marketIfTouched: {},
		quantity:{},
		tif:{},
		oto:{}
	};
	order.id=this.modifyingOrder.id;
	order.symbol=this.stx.chart.symbol;
	order.action=this.modifyingOrder.action;
	order.oco=this.modifyingOrder.oco;

	if(this.modifyingOrder.limit){
		order.limit.old=this.modifyingOrder.limit;
	}else if(this.modifyingOrder.stop){
		order.stop.old=this.modifyingOrder.stop;		
	}else if(this.modifyingOrder.marketIfTouched){
		order.marketIfTouched.old=this.modifyingOrder.marketIfTouched;		
	}
	var currentPrice=this.getCurrentPriceForOrder(order.action);
	var centerPrice=parseFloat(this.elements.dragLineCenterPrice.innerHTML);

	if(order.action=="buy" || order.action=="cover"){
		if(centerPrice<=currentPrice) order.limit["new"]=centerPrice;
		else order.stop["new"]=centerPrice;
	}else{
		if(centerPrice>=currentPrice) order.limit["new"]=centerPrice;
		else order.stop["new"]=centerPrice;
	}

	order.quantity.old=this.modifyingOrder.quantity;
	order.quantity["new"]=this.quantityFromValue(this.elements.limitShares.value);

	order.tif.old=this.modifyingOrder.tif;
	order.tif["new"]=this.elements.limitTIF.value;

	order.oto.old=this.modifyingOrder.oto;

	// If either below or above lines are displayed then we create an oto
	if(this.dom.otoAbove.style.display!="none" || this.dom.otoBelow.style.display!="none"){
		var oto=this.createOCOFromGUI();					// re-use existing code to create OCO
		if (oto[0]) oto[0].tif="GTC";
		if (oto[1]) oto[1].tif="GTC";
		order.oto["new"]=oto;
	}else{
		order.oto["new"]=null;
	}

	return order;
};

/**
 * Creates the confirmation dialog for a replace order. This does nothing if no change is detected between the original and new orders.
 * The class "no-change" is appended to an html element in the dialog if no change in that parameter occurred, for instance quantity may
 * not change but price may. This class can be used to style the dialog to indicate which values are changing.
 */
STX.TFC.prototype.confirmReplace=function(order){
	var descriptionNode=$$$("#tfcConfirmReplace .tfcOrderDescription");
	var quantityNodeOld=$$$("#tfcConfirmReplace .tfcOrderQuantityOld");
	var priceNodeOld=$$$("#tfcConfirmReplace .tfcOrderPriceOld");
	var tifNodeOld=$$$("#tfcConfirmReplace .tfcOrderTifOld");
	var otoNodeOld=$$$("#tfcConfirmReplace .tfcOrderOTOOld");
	var quantityNodeNew=$$$("#tfcConfirmReplace .tfcOrderQuantityNew");
	var priceNodeNew=$$$("#tfcConfirmReplace .tfcOrderPriceNew");
	var tifNodeNew=$$$("#tfcConfirmReplace .tfcOrderTifNew");
	var otoNodeNew=$$$("#tfcConfirmReplace .tfcOrderOTONew");
	var otoLine=$$$("#tfcConfirmReplace .tfc-confirm-oto");

	var actionText=order.action;
	var description=actionText.capitalize();
	description+=" " + order.symbol;
	descriptionNode.innerHTML=description.capitalize();

	var foundAChange=false;
	
	quantityNodeNew.innerHTML=order.quantity["new"];
	quantityNodeOld.innerHTML=order.quantity.old;
	if(order.quantity.old!=order.quantity["new"]){
		STX.unappendClassName(quantityNodeOld, "no-change");
		foundAChange=true;
	}else{
		STX.appendClassName(quantityNodeOld, "no-change");
	}

	var priceOld, priceNew;
	if(order.limit.old) priceOld=this.formatPrice(order.limit.old) + " LMT";
	else if(order.stop.old) priceOld=this.formatPrice(order.stop.old) + " STP";
	else if(order.marketIfTouched.old) priceOld=this.formatPrice(order.marketIfTouched.old) + " MIT";
	else priceOld="MKT";

	if(order.limit["new"]) priceNew=this.formatPrice(order.limit["new"]) + " LMT";
	else if(order.stop["new"]) priceNew=this.formatPrice(order.stop["new"]) + " STP";
	else if(order.marketIfTouched["new"]) priceNew=this.formatPrice(order.marketIfTouched["new"]) + " MIT";
	else priceNew="MKT";

	priceNodeOld.innerHTML=priceOld;
	if(priceOld!=priceNew){
		STX.unappendClassName(priceNodeOld, "no-change");
		foundAChange=true;
	}else{
		STX.appendClassName(priceNodeOld, "no-change");
	}
	priceNodeNew.innerHTML=priceNew;

	tifNodeOld.innerHTML=order.tif.old;
	if(order.tif.old!=order.tif["new"]){
		STX.unappendClassName(tifNodeOld, "no-change");
		foundAChange=true;
	}else{
		STX.appendClassName(tifNodeOld, "no-change");
	}
	tifNodeNew.innerHTML=order.tif["new"];

	otoNodeOld.innerHTML=this.printableOTO(order.oto.old);
	otoNodeNew.innerHTML=this.printableOTO(order.oto["new"]);
	if(otoNodeOld.innerHTML!=otoNodeNew.innerHTML){
		STX.unappendClassName(otoNodeOld, "no-change");
		foundAChange=true;
	}else{
		STX.appendClassName(otoNodeOld, "no-change");
	}
	if(!order.oto.old && !order.oto["new"]){
		otoLine.style.display="none";
	}else{
		otoLine.style.display="";
	}


	if(!foundAChange) return;

	var submitButton=$$$("#tfcConfirmReplace .tfcSubmit");
	var abandonButton=$$$("#tfcConfirmReplace .tfcAbandon");
	function closure(self, order, submitButton){
		return function(){
			STX.clearSafeClickTouches(submitButton);
			STX.clearSafeClickTouches(abandonButton);
			STX.appendClassName($$$("#tfcConfirmReplace"), "tfc-pending");
			$$$("#tfcConfirmReplace .processOrder").style.display="block";
			self.placeOrder(order);
		};
	}
	STX.safeClickTouch(submitButton, closure(this, order, submitButton));
	STX.safeClickTouch(abandonButton, STX.DialogManager.dismissDialog);

	this.modalEnd();
	STX.DialogManager.displayDialog('tfcConfirmReplace');
	STX.unappendClassName($$$("#tfcConfirmReplace"), "tfc-pending");
	$$$("#tfcConfirmReplace .processOrder").style.display="none";
	$$$("#tfcConfirmReplace .orderProcessed").style.display="block";
};

/**
 * Creates a printable description of the oto legs for an order. This description is used to create the confirmation dialogs.
 * @param  {array} oto An array of orders in the oto
 * @return {string}     The printable description
 */
STX.TFC.prototype.printableOTO=function(oto){
	var str="";
	if(oto){
		for(var i=0;i<oto.length;i++){
			var leg=oto[i];
			if(i==1) str+=" / ";
			str+=leg.action.capitalize() + " " + this.printablePrice(leg);
		}
	}
	return str;
};

/**
 * Creates a confirmation dialog for an order. This method will return without enabling the dialog if no quantity has been specified.
 * @param  {Object} order The order to place
 */
STX.TFC.prototype.confirmOrder=function(order){
	var self=this;
	this.modalEnd();
	STX.unappendClassName($$$("#tfcConfirmOrder"), "tfc-pending");
	$$$("#tfcConfirmOrder .processOrder").style.display="block";
	$$$("#tfcConfirmOrder .orderProcessed").style.display="none";
	this.account.confirmOrder(this, order, function(confirmation){
		STX.DialogManager.displayDialog('tfcConfirmOrder');
		var descriptionNode=$$$("#tfcConfirmOrder .tfcOrderDescription");
		var priceNode=$$$("#tfcConfirmOrder .tfcOrderPrice");
		var tifNode=$$$("#tfcConfirmOrder .tfcOrderTif");
		var otoNode=$$$("#tfcConfirmOrder .tfc-confirm-oto");
		var basisNode=$$$("#tfcConfirmOrder .tfc-confirm-basis");
		var estPlNode=$$$("#tfcConfirmOrder .tfc-confirm-pl");

		var actionText=order.action;
		if(order.action=="limit_short") actionText+=" (short)";
		else if(order.action=="limit_cover") actionText+=" (to cover)";
		var description=actionText + " ";
		if(typeof order.quantity=="undefined"){
			if(!order.originalQuantity) order.originalQuantity=1;
			var input=document.createElement("input");
			input.type="number";
			input.max=order.originalQuantity;
			input.min=1;
			input.step=1;
			input.id="vsp_quantity";
			input.className="vspQuantity";
			input.setAttribute("value",input.max);
			input.setAttribute("oninput","{ this.value=this.value.replace(/[^0-9]/g,''); if(Number(this.value)<this.min) this.value=this.min; if(Number(this.value)>this.max) this.value=this.max; }");
			var divVsp=document.createElement("div");
			divVsp.appendChild(input);
			description+=divVsp.innerHTML;
		}else{
			description+=STX.commas(order.quantity);
		}
		if(!self.account.tradesLikeForex(self.stx.chart.symbol)){
			description+=" shares of";
		}
		description+=" " + order.symbol;
		descriptionNode.innerHTML=description.capitalize();

		var price="@ ";
		if(order.limit) price+=self.formatPrice(order.limit);
		if(order.stop) price+=self.formatPrice(order.stop) + " Stop";
		if(order.marketIfTouched) price+=self.formatPrice(order.marketIfTouched) + " MIT";
		if(!order.limit && !order.stop && !order.marketIfTouched) price+="MKT";

		priceNode.innerHTML=price;

		tifNode.innerHTML="";
		if(order.tif=="DAY") tifNode.appendChild(STX.translatableTextNode(self.stx,"Day Order"));
		else if(order.tif=="GTC") tifNode.appendChild(STX.translatableTextNode(self.stx,"Good Until Cancelled"));

		if(order.basis){
			basisNode.style.display="";
			$$$("#tfcConfirmOrder .tfcOrderBasis").innerHTML=order.basis;
		}else{
			basisNode.style.display="none";		
		}
		if(order.pl){
			estPlNode.style.display="";
			$$$("#tfcConfirmOrder .tfcOrderPl").innerHTML=order.pl;
		}else{
			estPlNode.style.display="none";		
		}

		if(order.oto){
			otoNode.style.display="";
			$$$("#tfcConfirmOrder .tfcOrderOTO").innerHTML=self.printableOTO(order.oto);
		}else{
			otoNode.style.display="none";		
		}

		var submitButton=$$$("#tfcConfirmOrder .tfcSubmit");
		var abandonButton=$$$("#tfcConfirmOrder .tfcAbandon");
		function closure(self, order, submitButton){
			return function(){
				if(!order.quantity) order.quantity=$$("vsp_quantity").value;
				if(!order.quantity) return;
				STX.clearSafeClickTouches(submitButton);
				STX.clearSafeClickTouches(abandonButton);
				$$$("#tfcConfirmOrder .processOrder").style.display="block";
				STX.appendClassName($$$("#tfcConfirmOrder"), "tfc-pending");
				self.placeOrder(order);
			};
		}
		STX.safeClickTouch(abandonButton, STX.DialogManager.dismissDialog);
		var div, i;
		if(confirmation && confirmation.errors){
			submitButton.style.display="none";
			for(i=0;i<confirmation.errors.length;i++){
				div=STX.newChild($$$("#tfcConfirmOrder .tfc-errors"), "div", null, confirmation.errors[i]);
			}
		}else{
			STX.clearNode($$$("#tfcConfirmOrder .tfc-errors"));
			submitButton.style.display="";
			STX.safeClickTouch(submitButton, closure(self, order, submitButton));
		}
		if(confirmation && confirmation.warnings){
			for(i=0;i<confirmation.warnings.length;i++){
				div=STX.newChild($$$("#tfcConfirmOrder .tfc-warnings"), "div", null, confirmation.warnings[i]);
			}
		}else{
			STX.clearNode($$$("#tfcConfirmOrder .tfc-warnings"));
		}
		$$$("#tfcConfirmOrder .processOrder").style.display="none";
		$$$("#tfcConfirmOrder .orderProcessed").style.display="block";
	});
};

/**
 * Creates a confirmation dialog for closing one trade.
 */
STX.TFC.prototype.confirmCloseTrade=function(trade){
	var contractSize=trade.contractSize?trade.contractSize:1;
	var order={
		type:"close",
		id:trade.id,
		action:"close",
		symbol:trade.symbol?trade.symbol:this.stx.chart.symbol,
		quantity:Math.abs(trade.quantity),
		tif:"DAY",
		basis:STX.yyyymmdd(new Date(trade.time))+" @"+trade.basis,
		pl:STX.money((trade.price-trade.basis)*trade.quantity*contractSize, null, STX.convertCurrencyCode(trade.currency))
	};
	if(this.config.skipConfirms){
		this.placeOrder(order);
	}else{
		this.confirmOrder(order);
	}
};

/**
 * Creates a confirmation dialog for closing one position.
 */
STX.TFC.prototype.confirmClosePosition=function(position){
	var contractSize=position.contractSize?position.contractSize:1;
	var order={
		type:"close",
		action:"close",
		symbol:position.symbol?position.symbol:this.stx.chart.symbol,
		quantity:Math.abs(position.quantity),
		tif:"DAY",
		pl:STX.money((position.price-position.basis)*position.quantity*contractSize, null, STX.convertCurrencyCode(position.currency))
	};
	if(this.config.skipConfirms){
		this.placeOrder(order);
	}else{
		this.confirmOrder(order);
	}
};

/**
 * Creates a confirmation dialog for reducing one trade (vsp).
 */
STX.TFC.prototype.confirmVspTrade=function(trade){
	var contractSize=trade.contractSize?trade.contractSize:1;
	var order={
		type:"order",
		vspId:trade.id,
		action:trade.quantity>0?"sell":"cover",
		symbol:trade.symbol?trade.symbol:this.stx.chart.symbol,
		tif:"DAY",
		originalQuantity:Math.abs(trade.quantity),
		basis:STX.yyyymmdd(new Date(trade.time))+" @"+trade.basis
	};
	this.confirmOrder(order);
};

/**
 * Creates a confirmation dialog for closing all trades/positions.
 * Once the confirmation is made the call to close all is made to the account.
 */
STX.TFC.prototype.confirmCloseAllPositions=function(){
	var self=this;
	this.modalEnd();
	STX.unappendClassName($$$("#tfcConfirmCloseAll"), "tfc-pending");
	$$$("#tfcConfirmCloseAll .processOrder").style.display="block";
	$$$("#tfcConfirmCloseAll .orderProcessed").style.display="none";
	STX.DialogManager.displayDialog('tfcConfirmCloseAll');

	var submitButton=$$$("#tfcConfirmCloseAll .tfcSubmit");
	var abandonButton=$$$("#tfcConfirmCloseAll .tfcAbandon");
	function closure(){
		STX.clearSafeClickTouches(submitButton);
		STX.clearSafeClickTouches(abandonButton);
		$$$("#tfcConfirmCloseAll .processOrder").style.display="block";
		STX.appendClassName($$$("#tfcConfirmCloseAll"), "tfc-pending");
		self.account.closeAllPositions(self, function(err){
			STX.DialogManager.dismissDialog();
			if(err) STX.alert(err);
			self.updateData();
			self.stx.draw();
		});
	}
	STX.safeClickTouch(abandonButton, STX.DialogManager.dismissDialog);
	STX.safeClickTouch(submitButton, closure);
	$$$("#tfcConfirmCloseAll .processOrder").style.display="none";
	$$$("#tfcConfirmCloseAll .orderProcessed").style.display="block";
};

/**
 * Either confirms or places the order depending on whether this.config.skipConfirms is set to true or not
 * @param {string} type Either "order","oco" or "replace" depending on the type of order
 * @param  {string} action The order action ("limit_buy","limit_sell","limit_short","limit_cover")
 */
STX.TFC.prototype.confirmOrPlaceOrder=function(type, action){
	var order;
	if(type=="order"){
		order=this.createOrderFromGUI(action);
		if(order.quantity===0) return;
		if(this.config.skipConfirms){
			this.placeOrder(order);
		}else{
			this.confirmOrder(order);
		}
	}else if(type=="OCO" || type=="bracket"){
		order=this.createOCOFromGUI();
		if(!order[0] || order[0].quantity===0) return;
		if(this.config.skipConfirms){
			this.placeOrder(order);
		}else{
			this.confirmOCO(order, type);
		}
	}else if(type=="replace"){
		order=this.createReplaceFromGUI();
		if(this.config.skipConfirms){
			this.placeOrder(order);
		}else{
			this.confirmReplace(order);
		}
	}
};

/**
 * Formats a price according to the conventions used on the y-axis. This should ensure that trade prices are always the same
 * number of decimal places as the security currently trades. It will further ensure that decimal places do not exceed
 * this.tradability.maxDecimalPlaces
 * @param  {number} price The price to format
 * @return {string}       The price formatted as text, fixed to the appropriate number of decimal places
 */
STX.TFC.prototype.formatPrice=function(price){
	var p=price.toString();
	if(this.tradability && (this.tradability.maxDecimalPlaces || this.tradability.maxDecimalPlaces===0)){
		p=price.toFixed(this.tradability.maxDecimalPlaces);
	}else{
		if(this.stx.chart.yAxis.priceFormatter && !this.stx.chart.isComparison){
			// use the formatter as long as it is not a comparison, otherwise it will have '%' signs
			p=this.stx.chart.yAxis.priceFormatter(this.stx, this.chart.panel, price);
		}else{
			p=this.stx.formatYAxisPrice(price, this.chart.panel);
		}
	}
	return p;
};

/**
 * Convenience function for creating a printable text label for the price of an order. This will be "MKT" or "xxx" or "xxx STP" or "xxx MIT".
 * @param  {object} order The order
 * @return {string}       The printable text.
 */
STX.TFC.prototype.printablePrice=function(order){
	if(!order.limit && !order.stop && !order.marketIfTouched) return "MKT";
	else if(order.limit && order.stop) return this.formatPrice(order.limit) + " LMT " + this.formatPrice(order.stop) + " STP";
	else if(order.limit) return this.formatPrice(order.limit);
	else if(order.stop) return this.formatPrice(order.stop) + " STP";
	else if(order.marketIfTouched) return this.formatPrice(order.marketIfTouched) + " MIT";
	return;
};

/**
 * Creates a confirmation dialog for an OCO (one cancels the other) order. This will be used for straddles, strangles and brackets. This
 * method will return without enabling the dialog if the quantity has not been specified.
 */
STX.TFC.prototype.confirmOCO=function(order, type){
	var descriptionNodes=[];
	descriptionNodes.push($$$("#tfcConfirmOCO .tfcOrderDescription1"));
	descriptionNodes.push($$$("#tfcConfirmOCO .tfcOrderDescription2"));
	var tifNode=$$$("#tfcConfirmOCO .tfcOrderTif");
	var headerNode=$$$("#tfcConfirmOCO h4");
	var orderLabels=document.querySelectorAll("#tfcConfirmOCO .stx-label");

	for(var i=0;i<2;i++){
		orderLabels[i].innerHTML="";
		descriptionNodes[i].innerHTML="";
	}
	
	for(i=0;i<order.length;i++){
		var oco=order[i];
		var description=oco.action + " " + STX.commas(oco.quantity);
		if(!this.account.tradesLikeForex(this.stx.chart.symbol)){
			description+=" shares of";
		}
		description+=" " + oco.symbol;
		description+=" @ ";
		description += this.printablePrice(oco);
		descriptionNodes[i].innerHTML=description.capitalize();
		headerNode.innerHTML="";
		orderLabels[i].innerHTML="";
		if(type=="bracket"){
			if(oco.stop) orderLabels[i].appendChild(STX.translatableTextNode(this.stx,"Stop Loss"));
			else if(oco.limit) orderLabels[i].appendChild(STX.translatableTextNode(this.stx,"Take Profit"));
			orderLabels[i].appendChild(document.createTextNode(":"));
			headerNode.appendChild(STX.translatableTextNode(this.stx,"Confirm: Bracket / Protect"));
		}else{
			orderLabels[i].appendChild(STX.translatableTextNode(this.stx,"Order"));
			orderLabels[i].appendChild(document.createTextNode(" "+(i+1)+":"));
			headerNode.appendChild(STX.translatableTextNode(this.stx,"Confirm: One Cancels the Other"));
		}
	}

	tifNode.innerHTML="";
	if(order[0].tif=="DAY") tifNode.appendChild(STX.translatableTextNode(this.stx,"Day Order"));
	else if(order[0].tif=="GTC") tifNode.appendChild(STX.translatableTextNode(this.stx,"Good Until Cancelled"));

	var submitButton=$$$("#tfcConfirmOCO .tfcSubmit");
	var abandonButton=$$$("#tfcConfirmOCO .tfcAbandon");
	function closure(self, order, submitButton){
		return function(){
			STX.clearSafeClickTouches(submitButton);
			STX.clearSafeClickTouches(abandonButton);
			$$$("#tfcConfirmOCO .processOrder").style.display="block";
			STX.appendClassName($$$("#tfcConfirmOCO"), "tfc-pending");
			self.placeOrder(order);
		};
	}
	STX.safeClickTouch(submitButton, closure(this, order, submitButton));
	STX.safeClickTouch(abandonButton, STX.DialogManager.dismissDialog);

	this.modalEnd();
	STX.DialogManager.displayDialog('tfcConfirmOCO');
	STX.unappendClassName($$$("#tfcConfirmOCO"), "tfc-pending");
	$$$("#tfcConfirmOCO .processOrder").style.display="none";
	$$$("#tfcConfirmOCO .orderProcessed").style.display="block";
};

/**
 * Called when a user submits an order or replace. This will pull up the appropriate confirmation dialog, assuming all order parameters have been filled in.
 * @param  {string} action The type of action
 */
STX.TFC.prototype.userAction=function(action){
	if(action=="replace"){
		this.confirmOrPlaceOrder("replace");
	}else if(action=="OCO"){
		this.confirmOrPlaceOrder("OCO", action);
	}else{
		if(this.activeTrade=="bracket_cover" || this.activeTrade=="bracket_sell"){
			this.confirmOrPlaceOrder("bracket", action);
		}else{
			this.confirmOrPlaceOrder("order", action);
		}
	}
};

/**
 * Checks if TIF has changed to/from MKT so it can set member var and redraw the form
 */
STX.TFC.prototype.tifHasChanged=function(){
	this.limitFlippedToMarket=this.elements.limitTIF.options[this.elements.limitTIF.selectedIndex].text=="MKT";
	this.updateValues();
	this.render();
};

/**
 * Turns the crosshairs off while the mouse is passing over an object such as an open order marker
 */
STX.TFC.prototype.crosshairsOff=function(){
	this.crosshairMouseOverState=this.stx.layout.crosshair;
	this.stx.layout.crosshair=false;
};

/**
 * Turns the crosshairs on when the mouse passes out of an object such as an open order marker
 */
STX.TFC.prototype.crosshairsOn=function(){
	if(this.crosshairsOriginallyOn===null)
		this.stx.layout.crosshair=this.crosshairMouseOverState;
};

/**
 * Puts the chart into a modal mode when the user is mousing over a TFC element. This prevents the chart
 * from scrolling with mouse movements or intercepting key strokes.
 */
STX.TFC.prototype.modalBegin=function(){
	if(this.stx.grabbingScreen) return;	// Don't intercept modal if the user is scrolling the chart
	this.stx.editingAnnotation=true;	// This prevents keystrokes from being intercepted
	this.stx.modalBegin();
};

/**
 * Takes the chart out of modal mode when the user mouses out of a TFC element.
 */
STX.TFC.prototype.modalEnd=function(){
	this.stx.modalEnd();
	this.stx.editingAnnotation=false;
};

/**
 * Start method for a drag operation. Callback from STX.safeDrag
 * @param  {Event} e    The mouse or touch event
 * @param  {HTMLElement} node The element that is being dragged
 */
STX.TFC.prototype.startDrag=function(e, node){
	if(node==this.dom.dragLineCenter){
		if(this.limitFlippedToMarket) return;  //market order, no dragging
	}
	this.initialPosition=STX.stripPX(node.style.top);
	this.stx.modalBegin();
	STX.appendClassName(node, "dragging");
};

/**
 * End method for a drag operation. Callback from STX.safeDrag
 * @param  {Event} e    The mouse or touch event
 * @param  {HTMLElement} node The element that was dragged
 */
STX.TFC.prototype.endDrag=function(e, node){
	this.stx.modalEnd();
	STX.unappendClassName(node, "dragging");
};

/**
 * Callback method for when marker order widget is dragged. This does nothing but reposition the widget for the convenience of the user.
 * @param  {Event} e The mouse or touch event
 */
STX.TFC.prototype.dragMarketOrder=function(e){
	var newPosition=this.initialPosition+e.displacementY;
	if(newPosition<0) newPosition=0;
	var parentNode=this.dom.marketOrder.parentNode;
	if(newPosition+this.dom.marketOrder.offsetHeight>parentNode.clientHeight){
		newPosition=parentNode.clientHeight-this.dom.marketOrder.offsetHeight;
	}
	this.dom.marketOrder.style.top=newPosition+"px";
};

/**
 * Adjusts the size of the "holder" whenever the chart panel is resized
 * @todo Abstract along with Marker holders
 */
STX.TFC.prototype.adjustMarker=function(){
	if(!this.chart.panel) return;
	//this.holder.style.display="block";
	//this.holder.style.width=this.chart.canvasWidth+"px";
	//this.holder.style.top=this.chart.panel.top+"px";
	//this.holder.style.height=this.chart.panel.height+"px";
};

/**
 * Enables an account. Without an enabled account TFC will not operate.
 * @param  {STX.TFC.Account} account The account to enable
 */
STX.TFC.prototype.enableAccount=function(account){
	this.account=account;
	if(this.account.configureAccount) this.account.configureAccount();
	if(!this.account.config) this.account.config={};
	if(!this.account.config.oto){
		this.elements.addOTOStop.style.display="none";
	}else{
		this.elements.addOTOStop.style.display="";		
	}
	if(this.account.config.gtcOnly) {
		this.elements.limitDay.disabled=true;
		this.elements.limitDay.selected=false;
		this.elements.ocoDay.disabled=true;
		this.elements.ocoDay.selected=false;
	}else{
		this.elements.limitDay.disabled=false;
		this.elements.limitDay.selected=true;
		this.elements.ocoDay.disabled=false;
		this.elements.ocoDay.selected=true;		
	}
	if(this.account.config.tradeActions) {
		this.elements.positionsViewMaintenance.style.display="";
	}else{
		this.elements.positionsViewMaintenance.style.display="none";
	}
	this.updateData();
};

/**
 * Sets a callback to be called when the screen needs to be resized. Used when the size of the TFC window is modified.
 * @param {function} resizeCallback The resize callback (i.e. resizeScreen())
 */
STX.TFC.prototype.setResizeCallback=function(resizeCallback){
	var self=this;
    STX.safeClickTouch($$$(".stx-trade-nav .stx-trade-ticket-toggle"), function(stx){
      return function(){
        stx.preAdjustScroll();
        STX.unappendClassName($$$(".stx-trade-nav"), "active");
        STX.appendClassName($$$(".stx-trade-info"), "active");
		self.refreshScrollWindows();
        resizeCallback();
        stx.postAdjustScroll();
      };
    }(this.stx));
    STX.safeClickTouch($$$(".stx-trade-info .stx-trade-ticket-toggle"), function(stx){
      return function(){
        stx.preAdjustScroll();
        STX.unappendClassName($$$(".stx-trade-info"), "active");
        STX.appendClassName($$$(".stx-trade-nav"), "active");
        resizeCallback();
        stx.postAdjustScroll();
      };
    }(this.stx));
};

/**
 * Adds touch/click events to menu items
 */
STX.TFC.prototype.establishMenu=function(){
	function f(self, componentName){
		return function(e){
			if(!self.stx.displayInitialized) return;
			if(self.menu[componentName].nodes[0].className.indexOf("active")==-1){
				self.clearActive();
				for(var i=0;i<self.menu[componentName].nodes.length;i++){
					STX.appendClassName(self.menu[componentName].nodes[i], "active");
				}
				self.newTrade(componentName);
			}else{
				self.closeTFC();
			}
		};
	}
	for(var componentName in this.menu){
		var components=this.menu[componentName].nodes;
		for(var i=0;i<components.length;i++){
			STX.safeClickTouch(components[i], f(this, componentName));
		}
	}
};

/**
 * This changes the view of the positions section.  The following views are supported:
 *    summary view:
 *       symbol, quantity, basis price, gl, gl% (positions only)
 *    lots view:
 *       symbol
 *       date, quantity, basis price, price, gl% (trades only)
 *    performance view:
 *       symbol, basis value, mv, gl% (positions only)
 *    maintenance view:
 *       symbol, price, gl%, close (positions)
 *       quantity, sl, tp, gl%, close (trades)
 * 
 * This will set the view type of the TFC object
 * @param {string} viewType View type, see above for supported views
 */
STX.TFC.prototype.changePositionsView=function(viewType){
	var nodes=document.querySelectorAll(".tfc-positions-view");
	for(var node=0;node<nodes.length;node++){
		if(STX.hasClassName(nodes[node],viewType)) STX.appendClassName(nodes[node],"active");
		else STX.unappendClassName(nodes[node],"active");
	}
	this.positionsView=viewType;
	this.updateData();
};

/**
 * This constructs the Trade From the Chart object. It is called from the actual object constructor. Within, we instantiate all
 * of the components that can be used in TFC and we set up all of the event handlers. TFC makes use of the "STX.safe" event handlers
 * to seamlessly handle both touch and mouse events through one interface.
 * @param {object} config Configuration object
 * @param {object} config.stx     The chart object to enable TFC.
 * @param {object} config.account Valid STX.Account object for querying brokerage and placing trades
 * @param {object} [config.chart]   The specific chart (panel) for trading componentry. Defaults to the default chart.
 * @param {boolean} [config.skipConfirms] If set to true then there will be no confirm messages. Pressing buy or sell buttons will place a trade! 
 */
STX.TFC.prototype.construct=function(config){
	var container=$$$(".tfc.container");
	this.config=config;
	this.chart=config.chart;
	this.stx=config.stx;
	this.width=container.offsetWidth;
	this.holder=this.stx.chart.panel.holder;
	//this.holder=document.createElement("DIV");
	//this.holder.className="stx-holder";
	//this.holder.style.position="absolute";
	//this.holder.style.left="0px";
	//this.holder.style.overflow="hidden";
	//this.stx.chart.container.appendChild(this.holder);
	this.adjustMarker();
	STXChart.prototype.append("adjustPanelPositions", function(self){
		return function(){
			self.adjustMarker();
		};
	}(this));
	STXChart.prototype.append("doDisplayCrosshairs", function(self){
		return function(){
			self.crosshairsOriginallyOn=this.layout.crosshair;
		};
	}(this));
	this.dom.dragLineAbove=$$$(".drag-price-line", container).cloneNode(true);
	this.dom.dragLineCenter=$$$(".drag-price-line", container).cloneNode(true);
	this.dom.dragLineBelow=$$$(".drag-price-line", container).cloneNode(true);
	this.dom.marketOrder=$$$(".market-order", container).cloneNode(true);
	this.dom.limitOrder=$$$(".stx-limit-order", container).cloneNode(true);
	this.dom.otoAbove=$$$(".OTO.stx-stop", container).cloneNode(true);
	this.dom.otoBelow=$$$(".OTO.stx-stop", container).cloneNode(true);
	this.dom.ocoOrder=$$$(".stx-oco-order", container).cloneNode(true);
	this.dom.ocoAbove=$$$(".oco.tfc-oco-above", container).cloneNode(true);
	this.dom.ocoBelow=$$$(".oco.tfc-oco-below", container).cloneNode(true);
	this.dom.shadeAbove=$$$(".tfc-shade", container).cloneNode(true);
	this.dom.shadeBelow=$$$(".tfc-shade", container).cloneNode(true);

	function mb(self){ return function(e){self.modalBegin();};}
	function me(self){ return function(e){self.modalEnd();};}
	for(var componentName in this.dom){
		var component=this.dom[componentName];
		this.holder.appendChild(component);
		if(!(componentName in {shadeAbove:true,shadeBelow:true})){
			STX.safeMouseOver(component, mb(this));
			STX.safeMouseOut(component, me(this));
		}
	}
	this.elements.marketBuy=$$$(".tfc-market-buy-action", this.dom.marketOrder);
	this.elements.marketSell=$$$(".tfc-market-sell-action", this.dom.marketOrder);
	this.elements.limitBuy=$$$(".click.tfc-buy", this.dom.limitOrder);
	this.elements.limitReplace=$$$(".click.tfc-replace", this.dom.limitOrder);
	this.elements.limitSell=$$$(".click.tfc-sell", this.dom.limitOrder);
	this.elements.limitShort=$$$(".click.tfc-short", this.dom.limitOrder);
	this.elements.limitCover=$$$(".click.tfc-cover", this.dom.limitOrder);
	this.elements.dragLineAbovePrice=$$$(".tfc-price", this.dom.dragLineAbove);
	this.elements.dragLineCenterPrice=$$$(".tfc-price", this.dom.dragLineCenter);
	this.elements.dragLineBelowPrice=$$$(".tfc-price", this.dom.dragLineBelow);
	this.elements.addOTOStop=$$$(".OTO.stop", this.dom.limitOrder);
	this.elements.removeOTOAbove=$$$(".stx-btn.stx-ico .stx-ico-close", this.dom.otoAbove);
	this.elements.addOTOLimit=$$$(".OTO.limit", this.dom.limitOrder);
	this.elements.removeOTOBelow=$$$(".stx-btn.stx-ico .stx-ico-close", this.dom.otoBelow);
	this.elements.sharesOwned=$$$(".tfc-shares-owned span", this.dom.limitOrder);
	this.elements.marketShares=$$$("input.tfc-shares", this.dom.marketOrder);
	this.elements.marketCurrency=$$$("input.tfc-currency", this.dom.marketOrder);
	this.elements.marketBracket=$$$(".tfc-market-section.complex",this.dom.marketOrder);
	this.elements.marketLossBracketDifferential=$$$(".tfc-market-section.complex input.tfc-market-loss-bracket", this.dom.marketOrder);
	this.elements.marketProfitBracketDifferential=$$$(".tfc-market-section.complex input.tfc-market-profit-bracket", this.dom.marketOrder);
	this.elements.limitShares=$$$("input.tfc-shares", this.dom.limitOrder);
	this.elements.limitCurrency=$$$("input.tfc-currency", this.dom.limitOrder);
	this.elements.gainAmount=$$$(".tfc-gain-amount", this.dom.limitOrder);
	this.elements.gainPercent=$$$(".tfc-gain-percent", this.dom.limitOrder);
	this.elements.aboveGainAmount=$$$(".tfc-gain-amount", this.dom.otoAbove);
	this.elements.aboveGainPercent=$$$(".tfc-gain-percent", this.dom.otoAbove);
	this.elements.belowGainAmount=$$$(".tfc-gain-amount", this.dom.otoBelow);
	this.elements.belowGainPercent=$$$(".tfc-gain-percent", this.dom.otoBelow);
	this.elements.ocoGainAmount=$$$(".tfc-gain-amount", this.dom.ocoOrder);
	this.elements.ocoGainPercent=$$$(".tfc-gain-percent", this.dom.ocoOrder);
	this.elements.otoAboveLegLabel=$$$(".tfc-oto-leg-label", this.dom.otoAbove);
	this.elements.otoBelowLegLabel=$$$(".tfc-oto-leg-label", this.dom.otoBelow);
	this.elements.limitRiskReward=$$$(".risk-reward .stx-data", this.dom.limitOrder);
	this.elements.ocoRiskReward=$$$(".inputTemplate .risk-reward", this.dom.ocoOrder);
	this.elements.askForexPart=$$$(".tfc-ask strong", this.dom.marketOrder);
	this.elements.bidForexPart=$$$(".tfc-bid strong", this.dom.marketOrder);
	this.elements.askEquityPart=$$$(".tfc-ask span", this.dom.marketOrder);
	this.elements.bidEquityPart=$$$(".tfc-bid span", this.dom.marketOrder);
	this.elements.ocoAboveHead=$$$(".stx-head", this.dom.ocoAbove);
	this.elements.ocoBelowHead=$$$(".stx-head", this.dom.ocoBelow);
	this.elements.ocoCurrency=$$$(".stx-data input", this.dom.ocoOrder);
	this.elements.ocoAboveShares=$$$(".stx-data span", this.dom.ocoAbove);
	this.elements.ocoBelowShares=$$$(".stx-data span", this.dom.ocoBelow);
	this.elements.ocoTrade=$$$(".click.oco", this.dom.ocoOrder);
	this.elements.limitTIF=$$$("select", this.dom.limitOrder);
	this.elements.ocoTIF=$$$("select", this.dom.ocoOrder);
	this.elements.limitDay=$$$("select .tfc-day", this.dom.limitOrder);
	this.elements.ocoDay=$$$("select .tfc-day", this.dom.ocoOrder);
	this.elements.bracketId=$$$(".tfc-bracketid", this.dom.ocoOrder);
	this.elements.abandonMarketOrder=$$$(".stx-btn.stx-ico", this.dom.marketOrder);
	this.elements.abandonLimitOrder=$$$(".stx-btn.stx-ico", this.dom.limitOrder);
	this.elements.abandonOCOOrder=$$$(".stx-btn.stx-ico", this.dom.ocoOrder);
	this.elements.cancelLimitOrder=$$$(".tfc-cancel-button", this.dom.limitOrder);
	this.elements.cancelDescription=$$$(".tfc-cancel-description", this.dom.limitOrder);

	this.elements.closeAllPositions=$$$(".stx-trade-panel .stx-btn.stx-close-all");
	this.elements.positionsViewSummary=$$$(".stx-trade-panel .tfc-positions-view.summary");
	this.elements.positionsViewLots=$$$(".stx-trade-panel .tfc-positions-view.lots");
	this.elements.positionsViewPerformance=$$$(".stx-trade-panel .tfc-positions-view.performance");
	this.elements.positionsViewMaintenance=$$$(".stx-trade-panel .tfc-positions-view.maintenance");

	this.elements.useDollarsLabel=document.querySelectorAll(".stx-label.tfc-price-dollars");
	this.elements.useAmountLabel=document.querySelectorAll(".stx-label.tfc-price-amt");
	this.elements.useSharesLabel=document.querySelectorAll(".stx-label.tfc-shares-to-buy");
	this.elements.useUnitsLabel=document.querySelectorAll(".stx-label.tfc-qty-to-buy");
	this.elements.usePipsLabel=document.querySelectorAll(".stx-label.tfc-pips");
	this.elements.usePointsLabel=document.querySelectorAll(".stx-label.tfc-points");

	this.templates.openOrderMarker=$$$(".tfc .open-order-marker", container);

	this.menu.enableMarket.nodes=document.querySelectorAll(".stx-trade-panel .stx-market");
	this.menu.enableBuy.nodes=document.querySelectorAll(".stx-trade-panel .stx-buy");
	this.menu.enableSell.nodes=document.querySelectorAll(".stx-trade-panel .stx-sell");
	this.menu.enableShort.nodes=document.querySelectorAll(".stx-trade-panel .stx-short");
	this.menu.enableCover.nodes=document.querySelectorAll(".stx-trade-panel .stx-cover");
	this.menu.enableStraddle.nodes=document.querySelectorAll(".stx-trade-panel .stx-straddle");
	this.menu.enableStrangle.nodes=document.querySelectorAll(".stx-trade-panel .stx-strangle");
	this.menu.enableBracket.nodes=document.querySelectorAll(".stx-trade-panel .stx-bracket");

	this.establishMenu();

	this.elements.currentCash=$$$(".stx-trade-panel .tfc-current-cash");
	this.elements.currentFunds=$$$(".stx-trade-panel .tfc-current-funds");
	this.elements.currentPosition=$$$(".stx-trade-panel .tfc-current-position");
	this.elements.openOrdersHeader=$$$(".stx-trade-current .stx-head-bar");

	var safety=STX.safeDrag(this.dom.marketOrder,
		function(self, node){ return function(e){ self.startDrag(e, node);};}(this, this.dom.marketOrder),
		function(self){ return function(e){ self.dragMarketOrder(e);};}(this),
		function(self){ return function(e){ self.endDrag(e, self.dom.marketOrder);};}(this)
	);

	STX.safeClickTouch(this.elements.marketBuy, function(self, action) { return function(e){ self.userAction(action);};}(this, "market_buy"), {"safety":safety});
	STX.safeClickTouch(this.elements.marketSell, function(self, action) { return function(e){ self.userAction(action);};}(this, "market_sell"), {"safety":safety});

	STX.safeClickTouch(this.elements.limitBuy, function(self, action) { return function(e){ self.userAction(action);};}(this, "limit_buy"), {"safety":safety});
	STX.safeClickTouch(this.elements.limitSell, function(self, action) { return function(e){ self.userAction(action);};}(this, "limit_sell"), {"safety":safety});
	STX.safeClickTouch(this.elements.limitShort, function(self, action) { return function(e){ self.userAction(action);};}(this, "limit_short"), {"safety":safety});
	STX.safeClickTouch(this.elements.limitCover, function(self, action) { return function(e){ self.userAction(action);};}(this, "limit_cover"), {"safety":safety});
	STX.safeClickTouch(this.elements.limitReplace, function(self, action) { return function(e){ self.userAction(action);};}(this, "replace"), {"safety":safety});

	STX.safeClickTouch(this.elements.ocoTrade, function(self, action) { return function(e){ self.userAction(action);};}(this, "OCO"), {"safety":safety});

	STX.safeDrag(this.dom.dragLineCenter,
		function(self, node){ return function(e){ self.startDrag(e, node);};}(this, this.dom.dragLineCenter),
		function(self){ return function(e){ self.dragCenterLine(e);};}(this),
		function(self){ return function(e){ self.endDrag(e, self.dom.dragLineCenter);};}(this)
	);
	safety=STX.safeDrag(this.dom.limitOrder,
		function(self, node){ return function(e){ self.startDrag(e, node);};}(this, this.dom.dragLineCenter),
		function(self){ return function(e){ self.dragCenterLine(e);};}(this),
		function(self){ return function(e){ self.endDrag(e, self.dom.dragLineCenter);};}(this)
	);
	STX.safeDrag(this.dom.dragLineAbove,
		function(self, node){ return function(e){ self.startDrag(e, node);};}(this, this.dom.dragLineAbove),
		function(self){ return function(e){ self.dragAboveLine(e);};}(this),
		function(self){ return function(e){ self.endDrag(e, self.dom.dragLineAbove);};}(this)
	);
	STX.safeDrag(this.dom.ocoAbove,
		function(self, node){ return function(e){ self.startDrag(e, node);};}(this, this.dom.dragLineAbove),
		function(self){ return function(e){ self.dragAboveLine(e);};}(this),
		function(self){ return function(e){ self.endDrag(e, self.dom.dragLineAbove);};}(this)
	);
	STX.safeDrag(this.dom.otoAbove,
		function(self, node){ return function(e){ self.startDrag(e, node);};}(this, this.dom.dragLineAbove),
		function(self){ return function(e){ self.dragAboveLine(e);};}(this),
		function(self){ return function(e){ self.endDrag(e, self.dom.dragLineAbove);};}(this)
	);
	STX.safeDrag(this.dom.dragLineBelow,
		function(self, node){ return function(e){ self.startDrag(e, node);};}(this, this.dom.dragLineBelow),
		function(self){ return function(e){ self.dragBelowLine(e);};}(this),
		function(self){ return function(e){ self.endDrag(e, self.dom.dragLineBelow);};}(this)
	);
	STX.safeDrag(this.dom.ocoBelow,
		function(self, node){ return function(e){ self.startDrag(e, node);};}(this, this.dom.dragLineBelow),
		function(self){ return function(e){ self.dragBelowLine(e);};}(this),
		function(self){ return function(e){ self.endDrag(e, self.dom.dragLineBelow);};}(this)
	);	
	STX.safeDrag(this.dom.otoBelow,
		function(self, node){ return function(e){ self.startDrag(e, node);};}(this, this.dom.dragLineBelow),
		function(self){ return function(e){ self.dragBelowLine(e);};}(this),
		function(self){ return function(e){ self.endDrag(e, self.dom.dragLineBelow);};}(this)
	);
	var sharedParams={"safety": safety};	// since addOTOStop and addOTOLimit are overlapping, on touch devices the touch event will trigger the first
											// and the click event will trigger the second! The effect is of a double click. To prevent this we set these
											// two nodes to use the same params for the safeClickTouch. Furthermore we hook up the safety from our draggable
											// limitOrder widget
	STX.safeClickTouch(this.elements.addOTOStop, function(self) { return function(e){ self.addOTOStop();};}(this), sharedParams);
	STX.safeClickTouch(this.elements.removeOTOAbove, function(self) { return function(e){ self.removeOTOAbove();};}(this));
	STX.safeClickTouch(this.elements.addOTOLimit, function(self) { return function(e){ self.addOTOLimit();};}(this), sharedParams);
	STX.safeClickTouch(this.elements.removeOTOBelow, function(self) { return function(e){ self.removeOTOBelow();};}(this));

	STXChart.prototype.append("draw", function(self) { return function(){ self.render();};}(this));

	// http://stackoverflow.com/questions/19335109/ios-7-safari-os-locks-up-for-4-seconds-when-clicking-focusing-on-a-html-input
	STX.safeClickTouch(this.elements.limitShares, function(self) { return function(e){
		if(STX.isIOS7or8){
			//e.preventDefault();
			//e.target.focus();
		}
        e.target.focus();
		self.setActiveInput("shares");
	};}(this));
	STX.safeClickTouch(this.elements.limitCurrency, function(self) { return function(e){
		if(STX.isIOS7or8){
			//e.preventDefault();
			//e.target.focus();
		}
        e.target.focus();
		self.setActiveInput("currency");
	};}(this));
	STX.safeClickTouch(this.elements.marketShares, function(self) { return function(e){
		if(STX.isIOS7or8){
			//e.preventDefault();
			//e.target.focus();
		}
        e.target.focus();
		self.setActiveInput("shares");
	};}(this));
	STX.safeClickTouch(this.elements.marketCurrency, function(self) { return function(e){
		if(STX.isIOS7or8){
			//e.preventDefault();
			//e.target.focus();
		}
        e.target.focus();
		self.setActiveInput("currency");
	};}(this));
	STX.safeClickTouch(this.elements.marketLossBracketDifferential, function(self) { return function(e){
		if(STX.isIOS7or8){
			e.preventDefault();
			e.target.focus();
		}
	};}(this));
	STX.safeClickTouch(this.elements.marketProfitBracketDifferential, function(self) { return function(e){
		if(STX.isIOS7or8){
			e.preventDefault();
			e.target.focus();
		}
	};}(this));
	STX.safeClickTouch(this.elements.limitTIF, function(self){ return function(e){
		e.stopPropagation();
	};}(this));

	this.elements.limitShares.addEventListener("change", function(self) { return function(e){ self.updateValues();};}(this));
	this.elements.limitCurrency.addEventListener("change", function(self) { return function(e){ self.updateValues();};}(this));
	this.elements.limitTIF.addEventListener("change", function(self){ return function(e){ self.tifHasChanged();};}(this));
	this.elements.marketShares.addEventListener("change", function(self) { return function(e){ self.updateValues();};}(this));
	this.elements.marketCurrency.addEventListener("change", function(self) { return function(e){ self.updateValues();};}(this));
	this.elements.marketLossBracketDifferential.addEventListener("change", function(self) { return function(e){ self.updateValues();};}(this));
	this.elements.marketProfitBracketDifferential.addEventListener("change", function(self) { return function(e){ self.updateValues();};}(this));
	this.elements.ocoCurrency.addEventListener("change", function(self) { return function(e){ self.updateValues();};}(this));

	STX.safeClickTouch(this.elements.abandonLimitOrder, function(self) { return function(e){ self.closeTFC();};}(this));
	STX.safeClickTouch(this.elements.abandonMarketOrder, function(self) { return function(e){ self.closeTFC();};}(this));
	STX.safeClickTouch(this.elements.abandonOCOOrder, function(self) { return function(e){ self.closeTFC();};}(this));
	STX.safeClickTouch(this.elements.cancelLimitOrder, function(self) { return function(e){ self.cancelOpenOrder();};}(this));
	STX.safeClickTouch(this.elements.closeAllPositions, function(self) { return function(e){ self.confirmCloseAllPositions();};}(this));
	STX.safeClickTouch(this.elements.positionsViewSummary, function(self) { return function(e){ self.changePositionsView("summary");};}(this));
	STX.safeClickTouch(this.elements.positionsViewLots, function(self) { return function(e){ self.changePositionsView("lots");};}(this));
	STX.safeClickTouch(this.elements.positionsViewPerformance, function(self) { return function(e){ self.changePositionsView("performance");};}(this));
	STX.safeClickTouch(this.elements.positionsViewMaintenance, function(self) { return function(e){ self.changePositionsView("maintenance");};}(this));

	if(config.showAbandonMarketOrder){
		this.elements.abandonMarketOrder.style.display="";
	}
	if(config.account){
		this.enableAccount(config.account);
	}
	
	STX.safeDrag(this.elements.openOrdersHeader,
		function(self, node){ return function(e){ self.startDrag(e, node);};}(this, this.elements.openOrdersHeader),
		function(self){ return function(e){ self.dragOrdersHeader(e);};}(this),
		function(self){ return function(e){ self.endDrag(e, self.elements.openOrdersHeader);};}(this)
	);

	window.addEventListener("resize", function(self){return function(){self.refreshScrollWindows();};}(this));

};
