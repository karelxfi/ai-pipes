import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    SetPeriphery: event("0x567da2faedc99f951794c7dc379b4906dcdd1d016fedb16916d1e9623901f216", "SetPeriphery(address,address)", {"views": p.address, "math": p.address}),
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", {"sender": indexed(p.address), "receiver": indexed(p.address), "value": p.uint256}),
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "Approval(address,address,uint256)", {"owner": indexed(p.address), "spender": indexed(p.address), "value": p.uint256}),
    TokenExchange: event("0x143f1f8e861fbdeddd5b46e844b7d3ac7b86a122f36e8c463859ee6811b1f29c", "TokenExchange(address,uint256,uint256,uint256,uint256,uint256,uint256)", {"buyer": indexed(p.address), "sold_id": p.uint256, "tokens_sold": p.uint256, "bought_id": p.uint256, "tokens_bought": p.uint256, "fee": p.uint256, "price_scale": p.uint256}),
    AddLiquidity: event("0x0e1f3c59f25a027e14a3f55c68245d22089c42b1dcd09f123a11d4af3c0d6f72", "AddLiquidity(address,address,uint256[2],uint256,uint256,uint256)", {"provider": indexed(p.address), "receiver": indexed(p.address), "token_amounts": p.fixedSizeArray(p.uint256, 2), "fee": p.uint256, "token_supply": p.uint256, "price_scale": p.uint256}),
    Donation: event("0xc05458c16b884817a70d3d18223db5fe4adb4cb541a5573bef0daae7a6f20542", "Donation(address,uint256[2])", {"donor": indexed(p.address), "token_amounts": p.fixedSizeArray(p.uint256, 2)}),
    RemoveLiquidity: event("0xdd3c0336a16f1b64f172b7bb0dad5b2b3c7c76f91e8c4aafd6aae60dce800153", "RemoveLiquidity(address,uint256[2],uint256)", {"provider": indexed(p.address), "token_amounts": p.fixedSizeArray(p.uint256, 2), "token_supply": p.uint256}),
    RemoveLiquidityOne: event("0xe200e24d4a4c7cd367dd9befe394dc8a14e6d58c88ff5e2f512d65a9e0aa9c5c", "RemoveLiquidityOne(address,uint256,uint256,uint256,uint256,uint256)", {"provider": indexed(p.address), "token_amount": p.uint256, "coin_index": p.uint256, "coin_amount": p.uint256, "approx_fee": p.uint256, "packed_price_scale": p.uint256}),
    RemoveLiquidityImbalance: event("0x22f9ea3e7d7b113cb423896d2e121f96a66c17814ac7f63d69096769fa3e2a55", "RemoveLiquidityImbalance(address,uint256,uint256[2],uint256,uint256)", {"provider": indexed(p.address), "lp_token_amount": p.uint256, "token_amounts": p.fixedSizeArray(p.uint256, 2), "approx_fee": p.uint256, "price_scale": p.uint256}),
    NewParameters: event("0xa32137411fc7c20db359079cd84af0e2cad58cd7a182a8a5e23e08e554e88bf0", "NewParameters(uint256,uint256,uint256,uint256,uint256,uint256)", {"mid_fee": p.uint256, "out_fee": p.uint256, "fee_gamma": p.uint256, "allowed_extra_profit": p.uint256, "adjustment_step": p.uint256, "ma_time": p.uint256}),
    RampAgamma: event("0xe35f0559b0642164e286b30df2077ec3a05426617a25db7578fd20ba39a6cd05", "RampAgamma(uint256,uint256,uint256,uint256,uint256,uint256)", {"initial_A": p.uint256, "future_A": p.uint256, "initial_gamma": p.uint256, "future_gamma": p.uint256, "initial_time": p.uint256, "future_time": p.uint256}),
    StopRampA: event("0x5f0e7fba3d100c9e19446e1c92fe436f0a9a22fe99669360e4fdd6d3de2fc284", "StopRampA(uint256,uint256,uint256)", {"current_A": p.uint256, "current_gamma": p.uint256, "time": p.uint256}),
    ClaimAdminFee: event("0x3bbd5f2f4711532d6e9ee88dfdf2f1468e9a4c3ae5e14d2e1a67bf4242d008d0", "ClaimAdminFee(address,uint256[2])", {"admin": indexed(p.address), "tokens": p.fixedSizeArray(p.uint256, 2)}),
    SetDonationDuration: event("0xb2cf7972e8e7c2db8a62b4c568cf133a24bf5910b2603ad8811e6bfc9a865322", "SetDonationDuration(uint256)", {"duration": p.uint256}),
    SetDonationProtection: event("0x6db4ade9cd8d6e671d6d713ab38d8889f9e3d4bbb319ca3389a516cf4efcf19d", "SetDonationProtection(uint256,uint256,uint256)", {"donation_protection_period": p.uint256, "donation_protection_lp_threshold": p.uint256, "donation_shares_max_ratio": p.uint256}),
    SetAdminFee: event("0x2f0d0ace1d699b471d7b39522b5c8aae053bce1b422b7a4fe8f09bd6562a4b74", "SetAdminFee(uint256)", {"admin_fee": p.uint256}),
}

export const functions = {
    'exchange(uint256,uint256,uint256,uint256)': fun("0x5b41b908", "exchange(uint256,uint256,uint256,uint256)", {"i": p.uint256, "j": p.uint256, "dx": p.uint256, "min_dy": p.uint256}, p.uint256),
    'exchange(uint256,uint256,uint256,uint256,address)': fun("0xa64833a0", "exchange(uint256,uint256,uint256,uint256,address)", {"i": p.uint256, "j": p.uint256, "dx": p.uint256, "min_dy": p.uint256, "receiver": p.address}, p.uint256),
    'exchange_received(uint256,uint256,uint256,uint256)': fun("0x29b244bb", "exchange_received(uint256,uint256,uint256,uint256)", {"i": p.uint256, "j": p.uint256, "dx": p.uint256, "min_dy": p.uint256}, p.uint256),
    'exchange_received(uint256,uint256,uint256,uint256,address)': fun("0x767691e7", "exchange_received(uint256,uint256,uint256,uint256,address)", {"i": p.uint256, "j": p.uint256, "dx": p.uint256, "min_dy": p.uint256, "receiver": p.address}, p.uint256),
    'add_liquidity(uint256[2],uint256)': fun("0x0b4c7e4d", "add_liquidity(uint256[2],uint256)", {"amounts": p.fixedSizeArray(p.uint256, 2), "min_mint_amount": p.uint256}, p.uint256),
    'add_liquidity(uint256[2],uint256,address)': fun("0x0c3e4b54", "add_liquidity(uint256[2],uint256,address)", {"amounts": p.fixedSizeArray(p.uint256, 2), "min_mint_amount": p.uint256, "receiver": p.address}, p.uint256),
    'add_liquidity(uint256[2],uint256,address,bool)': fun("0x86514738", "add_liquidity(uint256[2],uint256,address,bool)", {"amounts": p.fixedSizeArray(p.uint256, 2), "min_mint_amount": p.uint256, "receiver": p.address, "donation": p.bool}, p.uint256),
    'remove_liquidity(uint256,uint256[2])': fun("0x5b36389c", "remove_liquidity(uint256,uint256[2])", {"amount": p.uint256, "min_amounts": p.fixedSizeArray(p.uint256, 2)}, p.fixedSizeArray(p.uint256, 2)),
    'remove_liquidity(uint256,uint256[2],address)': fun("0x3eb1719f", "remove_liquidity(uint256,uint256[2],address)", {"amount": p.uint256, "min_amounts": p.fixedSizeArray(p.uint256, 2), "receiver": p.address}, p.fixedSizeArray(p.uint256, 2)),
    'remove_liquidity_fixed_out(uint256,uint256,uint256,uint256)': fun("0x512d6365", "remove_liquidity_fixed_out(uint256,uint256,uint256,uint256)", {"token_amount": p.uint256, "i": p.uint256, "amount_i": p.uint256, "min_amount_j": p.uint256}, p.uint256),
    'remove_liquidity_fixed_out(uint256,uint256,uint256,uint256,address)': fun("0xb2f9173e", "remove_liquidity_fixed_out(uint256,uint256,uint256,uint256,address)", {"token_amount": p.uint256, "i": p.uint256, "amount_i": p.uint256, "min_amount_j": p.uint256, "receiver": p.address}, p.uint256),
    'remove_liquidity_one_coin(uint256,uint256,uint256)': fun("0xf1dc3cc9", "remove_liquidity_one_coin(uint256,uint256,uint256)", {"lp_token_amount": p.uint256, "i": p.uint256, "min_amount": p.uint256}, p.uint256),
    'remove_liquidity_one_coin(uint256,uint256,uint256,address)': fun("0x0fbcee6e", "remove_liquidity_one_coin(uint256,uint256,uint256,address)", {"lp_token_amount": p.uint256, "i": p.uint256, "min_amount": p.uint256, "receiver": p.address}, p.uint256),
    user_supply: viewFun("0x1a2430cc", "user_supply()", {}, p.uint256),
    calc_withdraw_fixed_out: viewFun("0xd5f8da30", "calc_withdraw_fixed_out(uint256,uint256,uint256)", {"lp_token_amount": p.uint256, "i": p.uint256, "amount_i": p.uint256}, p.uint256),
    calc_withdraw_one_coin: viewFun("0x4fb08c5e", "calc_withdraw_one_coin(uint256,uint256)", {"lp_token_amount": p.uint256, "i": p.uint256}, p.uint256),
    transferFrom: fun("0x23b872dd", "transferFrom(address,address,uint256)", {"_from": p.address, "_to": p.address, "_value": p.uint256}, p.bool),
    transfer: fun("0xa9059cbb", "transfer(address,uint256)", {"_to": p.address, "_value": p.uint256}, p.bool),
    approve: fun("0x095ea7b3", "approve(address,uint256)", {"_spender": p.address, "_value": p.uint256}, p.bool),
    fee_receiver: viewFun("0xcab4d3db", "fee_receiver()", {}, p.address),
    admin: viewFun("0xf851a440", "admin()", {}, p.address),
    calc_token_amount: viewFun("0xed8e84f3", "calc_token_amount(uint256[2],bool)", {"amounts": p.fixedSizeArray(p.uint256, 2), "deposit": p.bool}, p.uint256),
    get_dy: viewFun("0x556d6e9f", "get_dy(uint256,uint256,uint256)", {"i": p.uint256, "j": p.uint256, "dx": p.uint256}, p.uint256),
    'get_dx(uint256,uint256,uint256)': viewFun("0x37ed3a7a", "get_dx(uint256,uint256,uint256)", {"i": p.uint256, "j": p.uint256, "dy": p.uint256}, p.uint256),
    'get_dx(uint256,uint256,uint256,uint256)': viewFun("0x48155d27", "get_dx(uint256,uint256,uint256,uint256)", {"i": p.uint256, "j": p.uint256, "dy": p.uint256, "n_iter": p.uint256}, p.uint256),
    lp_price: viewFun("0x54f0f7d5", "lp_price()", {}, p.uint256),
    get_virtual_price: viewFun("0xbb7b8b80", "get_virtual_price()", {}, p.uint256),
    price_oracle: viewFun("0x86fc88d3", "price_oracle()", {}, p.uint256),
    price_scale: viewFun("0xb9e8c9fd", "price_scale()", {}, p.uint256),
    fee: viewFun("0xddca3f43", "fee()", {}, p.uint256),
    'calc_token_fee(uint256[2],uint256[2])': viewFun("0xbcc8342e", "calc_token_fee(uint256[2],uint256[2])", {"amounts": p.fixedSizeArray(p.uint256, 2), "xp": p.fixedSizeArray(p.uint256, 2)}, p.uint256),
    'calc_token_fee(uint256[2],uint256[2],bool)': viewFun("0x326cc617", "calc_token_fee(uint256[2],uint256[2],bool)", {"amounts": p.fixedSizeArray(p.uint256, 2), "xp": p.fixedSizeArray(p.uint256, 2), "donation": p.bool}, p.uint256),
    'calc_token_fee(uint256[2],uint256[2],bool,bool)': viewFun("0x57832be6", "calc_token_fee(uint256[2],uint256[2],bool,bool)", {"amounts": p.fixedSizeArray(p.uint256, 2), "xp": p.fixedSizeArray(p.uint256, 2), "donation": p.bool, "deposit": p.bool}, p.uint256),
    A: viewFun("0xf446c1d0", "A()", {}, p.uint256),
    gamma: viewFun("0xb1373929", "gamma()", {}, p.uint256),
    mid_fee: viewFun("0x92526c0c", "mid_fee()", {}, p.uint256),
    out_fee: viewFun("0xee8de675", "out_fee()", {}, p.uint256),
    fee_gamma: viewFun("0x72d4f0e2", "fee_gamma()", {}, p.uint256),
    allowed_extra_profit: viewFun("0x49fe9e77", "allowed_extra_profit()", {}, p.uint256),
    adjustment_step: viewFun("0x083812e5", "adjustment_step()", {}, p.uint256),
    ma_time: viewFun("0x09c3da6a", "ma_time()", {}, p.uint256),
    precisions: viewFun("0x3620604b", "precisions()", {}, p.fixedSizeArray(p.uint256, 2)),
    fee_calc: viewFun("0x80823d9e", "fee_calc(uint256[2])", {"xp": p.fixedSizeArray(p.uint256, 2)}, p.uint256),
    ramp_A_gamma: fun("0x5e248072", "ramp_A_gamma(uint256,uint256,uint256)", {"future_A": p.uint256, "future_gamma": p.uint256, "future_time": p.uint256}, ),
    stop_ramp_A_gamma: fun("0x244c7c2e", "stop_ramp_A_gamma()", {}, ),
    apply_new_parameters: fun("0x6dbcf350", "apply_new_parameters(uint256,uint256,uint256,uint256,uint256,uint256)", {"_new_mid_fee": p.uint256, "_new_out_fee": p.uint256, "_new_fee_gamma": p.uint256, "_new_allowed_extra_profit": p.uint256, "_new_adjustment_step": p.uint256, "_new_ma_time": p.uint256}, ),
    set_donation_duration: fun("0xf5b2f016", "set_donation_duration(uint256)", {"duration": p.uint256}, ),
    set_donation_protection_params: fun("0x8325c002", "set_donation_protection_params(uint256,uint256,uint256)", {"_period": p.uint256, "_threshold": p.uint256, "_max_shares_ratio": p.uint256}, ),
    set_admin_fee: fun("0x3217902f", "set_admin_fee(uint256)", {"admin_fee": p.uint256}, ),
    set_periphery: fun("0x6fe26a34", "set_periphery(address,address)", {"views": p.address, "math": p.address}, ),
    MATH: viewFun("0xed6c1546", "MATH()", {}, p.address),
    VIEW: viewFun("0x2a3f192b", "VIEW()", {}, p.address),
    coins: viewFun("0xc6610657", "coins(uint256)", {"arg0": p.uint256}, p.address),
    factory: viewFun("0xc45a0155", "factory()", {}, p.address),
    last_prices: viewFun("0xc146bf94", "last_prices()", {}, p.uint256),
    last_timestamp: viewFun("0x4d23bfa0", "last_timestamp()", {}, p.uint256),
    initial_A_gamma: viewFun("0x204fe3d5", "initial_A_gamma()", {}, p.uint256),
    initial_A_gamma_time: viewFun("0xe89876ff", "initial_A_gamma_time()", {}, p.uint256),
    future_A_gamma: viewFun("0xf30cfad5", "future_A_gamma()", {}, p.uint256),
    future_A_gamma_time: viewFun("0xf9ed9597", "future_A_gamma_time()", {}, p.uint256),
    donation_shares: viewFun("0xa3bdf1b7", "donation_shares()", {}, p.uint256),
    donation_shares_max_ratio: viewFun("0x3d2699f2", "donation_shares_max_ratio()", {}, p.uint256),
    donation_duration: viewFun("0x0decf4a2", "donation_duration()", {}, p.uint256),
    last_donation_release_ts: viewFun("0x7c71109f", "last_donation_release_ts()", {}, p.uint256),
    donation_protection_expiry_ts: viewFun("0xd046b4ca", "donation_protection_expiry_ts()", {}, p.uint256),
    donation_protection_period: viewFun("0x1f88619c", "donation_protection_period()", {}, p.uint256),
    donation_protection_lp_threshold: viewFun("0xfe192e9e", "donation_protection_lp_threshold()", {}, p.uint256),
    balances: viewFun("0x4903b0d1", "balances(uint256)", {"arg0": p.uint256}, p.uint256),
    D: viewFun("0x0f529ba2", "D()", {}, p.uint256),
    xcp_profit: viewFun("0x7ba1a74d", "xcp_profit()", {}, p.uint256),
    xcp_profit_a: viewFun("0x0b7b594b", "xcp_profit_a()", {}, p.uint256),
    virtual_price: viewFun("0x0c46b72a", "virtual_price()", {}, p.uint256),
    packed_rebalancing_params: viewFun("0x3dd65478", "packed_rebalancing_params()", {}, p.uint256),
    packed_fee_params: viewFun("0xe3616405", "packed_fee_params()", {}, p.uint256),
    admin_fee: viewFun("0xfee3f7f9", "admin_fee()", {}, p.uint256),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    symbol: viewFun("0x95d89b41", "symbol()", {}, p.string),
    decimals: viewFun("0x313ce567", "decimals()", {}, p.uint8),
    version: viewFun("0x54fd4d50", "version()", {}, p.string),
    balanceOf: viewFun("0x70a08231", "balanceOf(address)", {"arg0": p.address}, p.uint256),
    allowance: viewFun("0xdd62ed3e", "allowance(address,address)", {"arg0": p.address, "arg1": p.address}, p.uint256),
    totalSupply: viewFun("0x18160ddd", "totalSupply()", {}, p.uint256),
}

export class Contract extends ContractBase {

    user_supply() {
        return this.eth_call(functions.user_supply, {})
    }

    calc_withdraw_fixed_out(lp_token_amount: Calc_withdraw_fixed_outParams["lp_token_amount"], i: Calc_withdraw_fixed_outParams["i"], amount_i: Calc_withdraw_fixed_outParams["amount_i"]) {
        return this.eth_call(functions.calc_withdraw_fixed_out, {lp_token_amount, i, amount_i})
    }

    calc_withdraw_one_coin(lp_token_amount: Calc_withdraw_one_coinParams["lp_token_amount"], i: Calc_withdraw_one_coinParams["i"]) {
        return this.eth_call(functions.calc_withdraw_one_coin, {lp_token_amount, i})
    }

    fee_receiver() {
        return this.eth_call(functions.fee_receiver, {})
    }

    admin() {
        return this.eth_call(functions.admin, {})
    }

    calc_token_amount(amounts: Calc_token_amountParams["amounts"], deposit: Calc_token_amountParams["deposit"]) {
        return this.eth_call(functions.calc_token_amount, {amounts, deposit})
    }

    get_dy(i: Get_dyParams["i"], j: Get_dyParams["j"], dx: Get_dyParams["dx"]) {
        return this.eth_call(functions.get_dy, {i, j, dx})
    }

    'get_dx(uint256,uint256,uint256)'(i: Get_dxParams_0["i"], j: Get_dxParams_0["j"], dy: Get_dxParams_0["dy"]) {
        return this.eth_call(functions['get_dx(uint256,uint256,uint256)'], {i, j, dy})
    }

    'get_dx(uint256,uint256,uint256,uint256)'(i: Get_dxParams_1["i"], j: Get_dxParams_1["j"], dy: Get_dxParams_1["dy"], n_iter: Get_dxParams_1["n_iter"]) {
        return this.eth_call(functions['get_dx(uint256,uint256,uint256,uint256)'], {i, j, dy, n_iter})
    }

    lp_price() {
        return this.eth_call(functions.lp_price, {})
    }

    get_virtual_price() {
        return this.eth_call(functions.get_virtual_price, {})
    }

    price_oracle() {
        return this.eth_call(functions.price_oracle, {})
    }

    price_scale() {
        return this.eth_call(functions.price_scale, {})
    }

    fee() {
        return this.eth_call(functions.fee, {})
    }

    'calc_token_fee(uint256[2],uint256[2])'(amounts: Calc_token_feeParams_0["amounts"], xp: Calc_token_feeParams_0["xp"]) {
        return this.eth_call(functions['calc_token_fee(uint256[2],uint256[2])'], {amounts, xp})
    }

    'calc_token_fee(uint256[2],uint256[2],bool)'(amounts: Calc_token_feeParams_1["amounts"], xp: Calc_token_feeParams_1["xp"], donation: Calc_token_feeParams_1["donation"]) {
        return this.eth_call(functions['calc_token_fee(uint256[2],uint256[2],bool)'], {amounts, xp, donation})
    }

    'calc_token_fee(uint256[2],uint256[2],bool,bool)'(amounts: Calc_token_feeParams_2["amounts"], xp: Calc_token_feeParams_2["xp"], donation: Calc_token_feeParams_2["donation"], deposit: Calc_token_feeParams_2["deposit"]) {
        return this.eth_call(functions['calc_token_fee(uint256[2],uint256[2],bool,bool)'], {amounts, xp, donation, deposit})
    }

    A() {
        return this.eth_call(functions.A, {})
    }

    gamma() {
        return this.eth_call(functions.gamma, {})
    }

    mid_fee() {
        return this.eth_call(functions.mid_fee, {})
    }

    out_fee() {
        return this.eth_call(functions.out_fee, {})
    }

    fee_gamma() {
        return this.eth_call(functions.fee_gamma, {})
    }

    allowed_extra_profit() {
        return this.eth_call(functions.allowed_extra_profit, {})
    }

    adjustment_step() {
        return this.eth_call(functions.adjustment_step, {})
    }

    ma_time() {
        return this.eth_call(functions.ma_time, {})
    }

    precisions() {
        return this.eth_call(functions.precisions, {})
    }

    fee_calc(xp: Fee_calcParams["xp"]) {
        return this.eth_call(functions.fee_calc, {xp})
    }

    MATH() {
        return this.eth_call(functions.MATH, {})
    }

    VIEW() {
        return this.eth_call(functions.VIEW, {})
    }

    coins(arg0: CoinsParams["arg0"]) {
        return this.eth_call(functions.coins, {arg0})
    }

    factory() {
        return this.eth_call(functions.factory, {})
    }

    last_prices() {
        return this.eth_call(functions.last_prices, {})
    }

    last_timestamp() {
        return this.eth_call(functions.last_timestamp, {})
    }

    initial_A_gamma() {
        return this.eth_call(functions.initial_A_gamma, {})
    }

    initial_A_gamma_time() {
        return this.eth_call(functions.initial_A_gamma_time, {})
    }

    future_A_gamma() {
        return this.eth_call(functions.future_A_gamma, {})
    }

    future_A_gamma_time() {
        return this.eth_call(functions.future_A_gamma_time, {})
    }

    donation_shares() {
        return this.eth_call(functions.donation_shares, {})
    }

    donation_shares_max_ratio() {
        return this.eth_call(functions.donation_shares_max_ratio, {})
    }

    donation_duration() {
        return this.eth_call(functions.donation_duration, {})
    }

    last_donation_release_ts() {
        return this.eth_call(functions.last_donation_release_ts, {})
    }

    donation_protection_expiry_ts() {
        return this.eth_call(functions.donation_protection_expiry_ts, {})
    }

    donation_protection_period() {
        return this.eth_call(functions.donation_protection_period, {})
    }

    donation_protection_lp_threshold() {
        return this.eth_call(functions.donation_protection_lp_threshold, {})
    }

    balances(arg0: BalancesParams["arg0"]) {
        return this.eth_call(functions.balances, {arg0})
    }

    D() {
        return this.eth_call(functions.D, {})
    }

    xcp_profit() {
        return this.eth_call(functions.xcp_profit, {})
    }

    xcp_profit_a() {
        return this.eth_call(functions.xcp_profit_a, {})
    }

    virtual_price() {
        return this.eth_call(functions.virtual_price, {})
    }

    packed_rebalancing_params() {
        return this.eth_call(functions.packed_rebalancing_params, {})
    }

    packed_fee_params() {
        return this.eth_call(functions.packed_fee_params, {})
    }

    admin_fee() {
        return this.eth_call(functions.admin_fee, {})
    }

    name() {
        return this.eth_call(functions.name, {})
    }

    symbol() {
        return this.eth_call(functions.symbol, {})
    }

    decimals() {
        return this.eth_call(functions.decimals, {})
    }

    version() {
        return this.eth_call(functions.version, {})
    }

    balanceOf(arg0: BalanceOfParams["arg0"]) {
        return this.eth_call(functions.balanceOf, {arg0})
    }

    allowance(arg0: AllowanceParams["arg0"], arg1: AllowanceParams["arg1"]) {
        return this.eth_call(functions.allowance, {arg0, arg1})
    }

    totalSupply() {
        return this.eth_call(functions.totalSupply, {})
    }
}

/// Event types
export type SetPeripheryEventArgs = EParams<typeof events.SetPeriphery>
export type TransferEventArgs = EParams<typeof events.Transfer>
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type TokenExchangeEventArgs = EParams<typeof events.TokenExchange>
export type AddLiquidityEventArgs = EParams<typeof events.AddLiquidity>
export type DonationEventArgs = EParams<typeof events.Donation>
export type RemoveLiquidityEventArgs = EParams<typeof events.RemoveLiquidity>
export type RemoveLiquidityOneEventArgs = EParams<typeof events.RemoveLiquidityOne>
export type RemoveLiquidityImbalanceEventArgs = EParams<typeof events.RemoveLiquidityImbalance>
export type NewParametersEventArgs = EParams<typeof events.NewParameters>
export type RampAgammaEventArgs = EParams<typeof events.RampAgamma>
export type StopRampAEventArgs = EParams<typeof events.StopRampA>
export type ClaimAdminFeeEventArgs = EParams<typeof events.ClaimAdminFee>
export type SetDonationDurationEventArgs = EParams<typeof events.SetDonationDuration>
export type SetDonationProtectionEventArgs = EParams<typeof events.SetDonationProtection>
export type SetAdminFeeEventArgs = EParams<typeof events.SetAdminFee>

/// Function types
export type ExchangeParams_0 = FunctionArguments<typeof functions['exchange(uint256,uint256,uint256,uint256)']>
export type ExchangeReturn_0 = FunctionReturn<typeof functions['exchange(uint256,uint256,uint256,uint256)']>

export type ExchangeParams_1 = FunctionArguments<typeof functions['exchange(uint256,uint256,uint256,uint256,address)']>
export type ExchangeReturn_1 = FunctionReturn<typeof functions['exchange(uint256,uint256,uint256,uint256,address)']>

export type Exchange_receivedParams_0 = FunctionArguments<typeof functions['exchange_received(uint256,uint256,uint256,uint256)']>
export type Exchange_receivedReturn_0 = FunctionReturn<typeof functions['exchange_received(uint256,uint256,uint256,uint256)']>

export type Exchange_receivedParams_1 = FunctionArguments<typeof functions['exchange_received(uint256,uint256,uint256,uint256,address)']>
export type Exchange_receivedReturn_1 = FunctionReturn<typeof functions['exchange_received(uint256,uint256,uint256,uint256,address)']>

export type Add_liquidityParams_0 = FunctionArguments<typeof functions['add_liquidity(uint256[2],uint256)']>
export type Add_liquidityReturn_0 = FunctionReturn<typeof functions['add_liquidity(uint256[2],uint256)']>

export type Add_liquidityParams_1 = FunctionArguments<typeof functions['add_liquidity(uint256[2],uint256,address)']>
export type Add_liquidityReturn_1 = FunctionReturn<typeof functions['add_liquidity(uint256[2],uint256,address)']>

export type Add_liquidityParams_2 = FunctionArguments<typeof functions['add_liquidity(uint256[2],uint256,address,bool)']>
export type Add_liquidityReturn_2 = FunctionReturn<typeof functions['add_liquidity(uint256[2],uint256,address,bool)']>

export type Remove_liquidityParams_0 = FunctionArguments<typeof functions['remove_liquidity(uint256,uint256[2])']>
export type Remove_liquidityReturn_0 = FunctionReturn<typeof functions['remove_liquidity(uint256,uint256[2])']>

export type Remove_liquidityParams_1 = FunctionArguments<typeof functions['remove_liquidity(uint256,uint256[2],address)']>
export type Remove_liquidityReturn_1 = FunctionReturn<typeof functions['remove_liquidity(uint256,uint256[2],address)']>

export type Remove_liquidity_fixed_outParams_0 = FunctionArguments<typeof functions['remove_liquidity_fixed_out(uint256,uint256,uint256,uint256)']>
export type Remove_liquidity_fixed_outReturn_0 = FunctionReturn<typeof functions['remove_liquidity_fixed_out(uint256,uint256,uint256,uint256)']>

export type Remove_liquidity_fixed_outParams_1 = FunctionArguments<typeof functions['remove_liquidity_fixed_out(uint256,uint256,uint256,uint256,address)']>
export type Remove_liquidity_fixed_outReturn_1 = FunctionReturn<typeof functions['remove_liquidity_fixed_out(uint256,uint256,uint256,uint256,address)']>

export type Remove_liquidity_one_coinParams_0 = FunctionArguments<typeof functions['remove_liquidity_one_coin(uint256,uint256,uint256)']>
export type Remove_liquidity_one_coinReturn_0 = FunctionReturn<typeof functions['remove_liquidity_one_coin(uint256,uint256,uint256)']>

export type Remove_liquidity_one_coinParams_1 = FunctionArguments<typeof functions['remove_liquidity_one_coin(uint256,uint256,uint256,address)']>
export type Remove_liquidity_one_coinReturn_1 = FunctionReturn<typeof functions['remove_liquidity_one_coin(uint256,uint256,uint256,address)']>

export type User_supplyParams = FunctionArguments<typeof functions.user_supply>
export type User_supplyReturn = FunctionReturn<typeof functions.user_supply>

export type Calc_withdraw_fixed_outParams = FunctionArguments<typeof functions.calc_withdraw_fixed_out>
export type Calc_withdraw_fixed_outReturn = FunctionReturn<typeof functions.calc_withdraw_fixed_out>

export type Calc_withdraw_one_coinParams = FunctionArguments<typeof functions.calc_withdraw_one_coin>
export type Calc_withdraw_one_coinReturn = FunctionReturn<typeof functions.calc_withdraw_one_coin>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

export type TransferParams = FunctionArguments<typeof functions.transfer>
export type TransferReturn = FunctionReturn<typeof functions.transfer>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type Fee_receiverParams = FunctionArguments<typeof functions.fee_receiver>
export type Fee_receiverReturn = FunctionReturn<typeof functions.fee_receiver>

export type AdminParams = FunctionArguments<typeof functions.admin>
export type AdminReturn = FunctionReturn<typeof functions.admin>

export type Calc_token_amountParams = FunctionArguments<typeof functions.calc_token_amount>
export type Calc_token_amountReturn = FunctionReturn<typeof functions.calc_token_amount>

export type Get_dyParams = FunctionArguments<typeof functions.get_dy>
export type Get_dyReturn = FunctionReturn<typeof functions.get_dy>

export type Get_dxParams_0 = FunctionArguments<typeof functions['get_dx(uint256,uint256,uint256)']>
export type Get_dxReturn_0 = FunctionReturn<typeof functions['get_dx(uint256,uint256,uint256)']>

export type Get_dxParams_1 = FunctionArguments<typeof functions['get_dx(uint256,uint256,uint256,uint256)']>
export type Get_dxReturn_1 = FunctionReturn<typeof functions['get_dx(uint256,uint256,uint256,uint256)']>

export type Lp_priceParams = FunctionArguments<typeof functions.lp_price>
export type Lp_priceReturn = FunctionReturn<typeof functions.lp_price>

export type Get_virtual_priceParams = FunctionArguments<typeof functions.get_virtual_price>
export type Get_virtual_priceReturn = FunctionReturn<typeof functions.get_virtual_price>

export type Price_oracleParams = FunctionArguments<typeof functions.price_oracle>
export type Price_oracleReturn = FunctionReturn<typeof functions.price_oracle>

export type Price_scaleParams = FunctionArguments<typeof functions.price_scale>
export type Price_scaleReturn = FunctionReturn<typeof functions.price_scale>

export type FeeParams = FunctionArguments<typeof functions.fee>
export type FeeReturn = FunctionReturn<typeof functions.fee>

export type Calc_token_feeParams_0 = FunctionArguments<typeof functions['calc_token_fee(uint256[2],uint256[2])']>
export type Calc_token_feeReturn_0 = FunctionReturn<typeof functions['calc_token_fee(uint256[2],uint256[2])']>

export type Calc_token_feeParams_1 = FunctionArguments<typeof functions['calc_token_fee(uint256[2],uint256[2],bool)']>
export type Calc_token_feeReturn_1 = FunctionReturn<typeof functions['calc_token_fee(uint256[2],uint256[2],bool)']>

export type Calc_token_feeParams_2 = FunctionArguments<typeof functions['calc_token_fee(uint256[2],uint256[2],bool,bool)']>
export type Calc_token_feeReturn_2 = FunctionReturn<typeof functions['calc_token_fee(uint256[2],uint256[2],bool,bool)']>

export type AParams = FunctionArguments<typeof functions.A>
export type AReturn = FunctionReturn<typeof functions.A>

export type GammaParams = FunctionArguments<typeof functions.gamma>
export type GammaReturn = FunctionReturn<typeof functions.gamma>

export type Mid_feeParams = FunctionArguments<typeof functions.mid_fee>
export type Mid_feeReturn = FunctionReturn<typeof functions.mid_fee>

export type Out_feeParams = FunctionArguments<typeof functions.out_fee>
export type Out_feeReturn = FunctionReturn<typeof functions.out_fee>

export type Fee_gammaParams = FunctionArguments<typeof functions.fee_gamma>
export type Fee_gammaReturn = FunctionReturn<typeof functions.fee_gamma>

export type Allowed_extra_profitParams = FunctionArguments<typeof functions.allowed_extra_profit>
export type Allowed_extra_profitReturn = FunctionReturn<typeof functions.allowed_extra_profit>

export type Adjustment_stepParams = FunctionArguments<typeof functions.adjustment_step>
export type Adjustment_stepReturn = FunctionReturn<typeof functions.adjustment_step>

export type Ma_timeParams = FunctionArguments<typeof functions.ma_time>
export type Ma_timeReturn = FunctionReturn<typeof functions.ma_time>

export type PrecisionsParams = FunctionArguments<typeof functions.precisions>
export type PrecisionsReturn = FunctionReturn<typeof functions.precisions>

export type Fee_calcParams = FunctionArguments<typeof functions.fee_calc>
export type Fee_calcReturn = FunctionReturn<typeof functions.fee_calc>

export type Ramp_A_gammaParams = FunctionArguments<typeof functions.ramp_A_gamma>
export type Ramp_A_gammaReturn = FunctionReturn<typeof functions.ramp_A_gamma>

export type Stop_ramp_A_gammaParams = FunctionArguments<typeof functions.stop_ramp_A_gamma>
export type Stop_ramp_A_gammaReturn = FunctionReturn<typeof functions.stop_ramp_A_gamma>

export type Apply_new_parametersParams = FunctionArguments<typeof functions.apply_new_parameters>
export type Apply_new_parametersReturn = FunctionReturn<typeof functions.apply_new_parameters>

export type Set_donation_durationParams = FunctionArguments<typeof functions.set_donation_duration>
export type Set_donation_durationReturn = FunctionReturn<typeof functions.set_donation_duration>

export type Set_donation_protection_paramsParams = FunctionArguments<typeof functions.set_donation_protection_params>
export type Set_donation_protection_paramsReturn = FunctionReturn<typeof functions.set_donation_protection_params>

export type Set_admin_feeParams = FunctionArguments<typeof functions.set_admin_fee>
export type Set_admin_feeReturn = FunctionReturn<typeof functions.set_admin_fee>

export type Set_peripheryParams = FunctionArguments<typeof functions.set_periphery>
export type Set_peripheryReturn = FunctionReturn<typeof functions.set_periphery>

export type MATHParams = FunctionArguments<typeof functions.MATH>
export type MATHReturn = FunctionReturn<typeof functions.MATH>

export type VIEWParams = FunctionArguments<typeof functions.VIEW>
export type VIEWReturn = FunctionReturn<typeof functions.VIEW>

export type CoinsParams = FunctionArguments<typeof functions.coins>
export type CoinsReturn = FunctionReturn<typeof functions.coins>

export type FactoryParams = FunctionArguments<typeof functions.factory>
export type FactoryReturn = FunctionReturn<typeof functions.factory>

export type Last_pricesParams = FunctionArguments<typeof functions.last_prices>
export type Last_pricesReturn = FunctionReturn<typeof functions.last_prices>

export type Last_timestampParams = FunctionArguments<typeof functions.last_timestamp>
export type Last_timestampReturn = FunctionReturn<typeof functions.last_timestamp>

export type Initial_A_gammaParams = FunctionArguments<typeof functions.initial_A_gamma>
export type Initial_A_gammaReturn = FunctionReturn<typeof functions.initial_A_gamma>

export type Initial_A_gamma_timeParams = FunctionArguments<typeof functions.initial_A_gamma_time>
export type Initial_A_gamma_timeReturn = FunctionReturn<typeof functions.initial_A_gamma_time>

export type Future_A_gammaParams = FunctionArguments<typeof functions.future_A_gamma>
export type Future_A_gammaReturn = FunctionReturn<typeof functions.future_A_gamma>

export type Future_A_gamma_timeParams = FunctionArguments<typeof functions.future_A_gamma_time>
export type Future_A_gamma_timeReturn = FunctionReturn<typeof functions.future_A_gamma_time>

export type Donation_sharesParams = FunctionArguments<typeof functions.donation_shares>
export type Donation_sharesReturn = FunctionReturn<typeof functions.donation_shares>

export type Donation_shares_max_ratioParams = FunctionArguments<typeof functions.donation_shares_max_ratio>
export type Donation_shares_max_ratioReturn = FunctionReturn<typeof functions.donation_shares_max_ratio>

export type Donation_durationParams = FunctionArguments<typeof functions.donation_duration>
export type Donation_durationReturn = FunctionReturn<typeof functions.donation_duration>

export type Last_donation_release_tsParams = FunctionArguments<typeof functions.last_donation_release_ts>
export type Last_donation_release_tsReturn = FunctionReturn<typeof functions.last_donation_release_ts>

export type Donation_protection_expiry_tsParams = FunctionArguments<typeof functions.donation_protection_expiry_ts>
export type Donation_protection_expiry_tsReturn = FunctionReturn<typeof functions.donation_protection_expiry_ts>

export type Donation_protection_periodParams = FunctionArguments<typeof functions.donation_protection_period>
export type Donation_protection_periodReturn = FunctionReturn<typeof functions.donation_protection_period>

export type Donation_protection_lp_thresholdParams = FunctionArguments<typeof functions.donation_protection_lp_threshold>
export type Donation_protection_lp_thresholdReturn = FunctionReturn<typeof functions.donation_protection_lp_threshold>

export type BalancesParams = FunctionArguments<typeof functions.balances>
export type BalancesReturn = FunctionReturn<typeof functions.balances>

export type DParams = FunctionArguments<typeof functions.D>
export type DReturn = FunctionReturn<typeof functions.D>

export type Xcp_profitParams = FunctionArguments<typeof functions.xcp_profit>
export type Xcp_profitReturn = FunctionReturn<typeof functions.xcp_profit>

export type Xcp_profit_aParams = FunctionArguments<typeof functions.xcp_profit_a>
export type Xcp_profit_aReturn = FunctionReturn<typeof functions.xcp_profit_a>

export type Virtual_priceParams = FunctionArguments<typeof functions.virtual_price>
export type Virtual_priceReturn = FunctionReturn<typeof functions.virtual_price>

export type Packed_rebalancing_paramsParams = FunctionArguments<typeof functions.packed_rebalancing_params>
export type Packed_rebalancing_paramsReturn = FunctionReturn<typeof functions.packed_rebalancing_params>

export type Packed_fee_paramsParams = FunctionArguments<typeof functions.packed_fee_params>
export type Packed_fee_paramsReturn = FunctionReturn<typeof functions.packed_fee_params>

export type Admin_feeParams = FunctionArguments<typeof functions.admin_fee>
export type Admin_feeReturn = FunctionReturn<typeof functions.admin_fee>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type VersionParams = FunctionArguments<typeof functions.version>
export type VersionReturn = FunctionReturn<typeof functions.version>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type AllowanceParams = FunctionArguments<typeof functions.allowance>
export type AllowanceReturn = FunctionReturn<typeof functions.allowance>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

