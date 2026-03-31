import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "Approval(address,address,uint256)", {"owner": indexed(p.address), "spender": indexed(p.address), "value": p.uint256}),
    Deposit: event("0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7", "Deposit(address,address,uint256,uint256)", {"sender": indexed(p.address), "owner": indexed(p.address), "assets": p.uint256, "shares": p.uint256}),
    LogChangeStatus: event("0xdae2efd92bba45bf6fe8237ff7f603eb9ff931c48299c25f0e33142b10803e5b", "LogChangeStatus(uint8)", {"status": indexed(p.uint8)}),
    LogClaimEthWithdrawal: event("0x0a5cab4b9cbf69c5b3c088b13d85bed49500df192dd6ed1f37f1c07b95ae240d", "LogClaimEthWithdrawal(uint256,uint256,uint256)", {"stEthAmount": indexed(p.uint256), "requestId": indexed(p.uint256), "protocolId": indexed(p.uint256)}),
    LogClaimFromAaveV3Lido: event("0x513d8d5b14acc6d6075cfecbc8ff4350fef7d3eedfa27c7a36122cd8ac41a732", "LogClaimFromAaveV3Lido(address[])", {"rewardAddresses": p.array(p.address)}),
    LogClaimFromKing: event("0x688908b3b6f18f843c609e2b98162e3b89013f8f1c5d3b9929cb2c7cd04fafd1", "LogClaimFromKing(uint256)", {"amount": p.uint256}),
    LogClaimFromSpark: event("0x830507870e42c567bd7bb74a437cf10d00db06a10dfd89aeeaadb9a3c58f2b2a", "LogClaimFromSpark(address[])", {"poolAddresses": p.array(p.address)}),
    LogClaimSteth: event("0xb2ab1f982fa6977ff8fd1994d14b2268706156bf198bdfe240d5a9e59e430807", "LogClaimSteth(uint256,uint256)", {"fromNFTId": p.uint256, "ethClaimed": p.uint256}),
    LogClaimStethAndPaybackFluid: event("0x2d670047af28734e5edaa9987eec2016b0d66e6e08f7306f3ca53cdc89709c78", "LogClaimStethAndPaybackFluid(uint256,uint256)", {"fromNFTId": p.uint256, "ethClaimed": p.uint256}),
    LogCollectRevenue: event("0xe51aa1403a9e643c4b893cc554346558066fface8846e300b02bf93b555cffea", "LogCollectRevenue(uint256,address)", {"amount": p.uint256, "to": indexed(p.address)}),
    LogConvertAaveV3wstETHToWeETH: event("0xe3159f16330f536d5c8c48889763643e4d7b4aac6db6b63d8066a1d3594f2274", "LogConvertAaveV3wstETHToWeETH(uint256,uint256,uint256)", {"wEthFlashloanAmount": p.uint256, "wstEthWithdrawAmount": p.uint256, "route": p.uint256}),
    LogEthSweep: event("0x8d456db853c26e1cb8e70fd5e3d473635c626923588bec9cf3d664f2cc7f1061", "LogEthSweep(uint256)", {"ethAmount": p.uint256}),
    LogFillVaultAvailability: event("0xf7643328badb482f8c55f4beed873cb5f3cf8dd702c6ce120eb55679f4e5fa1d", "LogFillVaultAvailability(uint8,uint256)", {"protocol": indexed(p.uint8), "withdrawAmount": p.uint256}),
    LogLeverage: event("0xfbe4c187d835d256a359a788fab7f526faea8aff9bd0efb7e4456150bf30ff97", "LogLeverage(uint8,uint256,uint256,uint256,address[],uint256[],uint256,uint256,uint256)", {"protocol": indexed(p.uint8), "route": indexed(p.uint256), "wstETHflashAmt": p.uint256, "ethAmountBorrow": p.uint256, "vaults": p.array(p.address), "vaultAmts": p.array(p.uint256), "swapMode": indexed(p.uint256), "unitAmt": p.uint256, "vaultSwapAmt": p.uint256}),
    LogLeverageDexRefinance: event("0x9651ed57feb5527fae226c512bff05603c9a16ab4f160a04b47d53f9f1d08015", "LogLeverageDexRefinance(uint8,uint256,uint256,uint256,uint256,int256,int256,int256,int256,int256,int256)", {"protocolFrom": indexed(p.uint8), "route": indexed(p.uint256), "wstETHflashAmount": p.uint256, "wETHBorrowAmount": p.uint256, "withdrawAmount": p.uint256, "perfectColShares": p.int256, "colToken0MinMax": p.int256, "colToken1MinMax": p.int256, "perfectDebtShares": p.int256, "debtToken0MinMax": p.int256, "debtToken1MinMax": p.int256}),
    LogQueueSteth: event("0x68db4868590ee84446d5d6704da3a0a0f2fb05c78b52ebae63d8c2a8b756c05f", "LogQueueSteth(uint8,uint256,uint256,uint256)", {"fromProtocolId": p.uint8, "route": p.uint256, "wETHBorrowAmount": p.uint256, "withdrawStethAmount": p.uint256}),
    LogRebalanceFromWeETHToWstETH: event("0x170c7e6232a6f90d76d34feb1292e1165840c74d2a5ea145983cac0368774ba5", "LogRebalanceFromWeETHToWstETH(uint256,uint256,uint256)", {"weEthFlashloanAmount_": indexed(p.uint256), "wstEthBorrowAmount_": indexed(p.uint256), "route_": indexed(p.uint256)}),
    LogRebalanceFromWstETHToWeETH: event("0x9b8f124bc62ce7ad7644056dad35a3f4af452ad8f4d00dd091836ac37b0e7f53", "LogRebalanceFromWstETHToWeETH(uint256,uint256,uint256)", {"wstEthFlashloanAmount_": indexed(p.uint256), "weEthWithdrawAmount_": indexed(p.uint256), "route_": indexed(p.uint256)}),
    LogRefinance: event("0xf542df6afae5d8a49d09b7d1b4c51776faca95451f656c9120841fa123ba0237", "LogRefinance(uint8,uint8,uint256,uint256,uint256,uint256)", {"protocolFrom": indexed(p.uint8), "protocolTo": indexed(p.uint8), "route": indexed(p.uint256), "wstETHflashAmount": p.uint256, "wETHBorrowAmount": p.uint256, "withdrawAmount": p.uint256}),
    LogSwapKingTokensToWeth: event("0x630d9c76d125826147deb04b0d6898ac49b1f2d306eedb33aaf663d461f4af2d", "LogSwapKingTokensToWeth(uint256,uint256,string)", {"sellAmount": p.uint256, "unitAmount": p.uint256, "swapConnectorName": p.string}),
    LogSwapWeETHToWstETH: event("0xcc3bfed82d8caae9f748c7f358004194f408d121c60271f11180ac980d96ec0b", "LogSwapWeETHToWstETH(uint256,uint256,uint256,string)", {"weEthSellAmount_": indexed(p.uint256), "route_": indexed(p.uint256), "revenueEarned_": p.uint256, "swapConnectorName_": p.string}),
    LogSwapWstETHToWeETH: event("0x7aa5b8eb9c8b61d3f72dbd97e94e720acbde171309d2245b5e4d5f27c33b1186", "LogSwapWstETHToWeETH(uint256,uint256,uint256,string)", {"wstEthSellAmount_": indexed(p.uint256), "route_": indexed(p.uint256), "revenueEarned_": p.uint256, "swapConnectorName_": p.string}),
    LogTransferKingTokensToTeamMS: event("0xc4b0f09b8de7520c50e82645f51bb458cf4e7d03254fbe7b778ae3f2d726671b", "LogTransferKingTokensToTeamMS(uint256)", {"amount": indexed(p.uint256)}),
    LogUnwindDexRefinance: event("0xfe96cc0bf22c595fdedd756ad7420710914cde9d690e0ddd69a47f26e7e78894", "LogUnwindDexRefinance(uint8,uint256,uint256,uint256,uint256,int256,int256,int256,int256,int256,int256)", {"protocolFrom": indexed(p.uint8), "route": indexed(p.uint256), "wstETHflashAmount": p.uint256, "wETHPaybackAmount": p.uint256, "withdrawAmount": p.uint256, "perfectColShares": p.int256, "colToken0MinMax": p.int256, "colToken1MinMax": p.int256, "perfectDebtShares": p.int256, "debtToken0MinMax": p.int256, "debtToken1MinMax": p.int256}),
    LogUpdateAggrMaxVaultRatio: event("0x83110a331bb55fc8cf6aa87ee522dd723c0f7460eb60d1ba6929692b15518e93", "LogUpdateAggrMaxVaultRatio(uint256,uint256)", {"oldAggrMaxVaultRatio": indexed(p.uint256), "aggrMaxVaultRatio": indexed(p.uint256)}),
    LogUpdateExchangePrice: event("0xcde545703e0372175cadfff811d67c32910c3dcb33199679b3271c4106afdf9a", "LogUpdateExchangePrice(uint256,uint256)", {"exchangePriceBefore": indexed(p.uint256), "exchangePriceAfter": indexed(p.uint256)}),
    LogUpdateFees: event("0x32bda72d412aaa44930a7f5639559d6002d70c0f7337375d76912b28972981ca", "LogUpdateFees(uint256,uint256,uint256)", {"revenueFeePercentage": indexed(p.uint256), "withdrawalFeePercentage": indexed(p.uint256), "withdrawFeeAbsoluteMin": indexed(p.uint256)}),
    LogUpdateLeverageMaxUnitAmountLimit: event("0x4e7e5b56c2466551cc0a33802ed738698fb8b574aca3ea243ea1e2154b6e732c", "LogUpdateLeverageMaxUnitAmountLimit(uint256,uint256)", {"oldLimit": indexed(p.uint256), "newLimit": indexed(p.uint256)}),
    LogUpdateMaxRiskRatio: event("0x747c3604711a9b0a4ecd77525c10a971d91b64c11dd67d7a1eea8cbc544755ce", "LogUpdateMaxRiskRatio(uint8,uint256)", {"protocolId": indexed(p.uint8), "newRiskRatio": p.uint256}),
    LogUpdateRebalancer: event("0xad476fc62f6b1b5d25b35bd756cfbfcd299b581b8dfb25d5492c4305a0969bd2", "LogUpdateRebalancer(address,bool)", {"rebalancer": indexed(p.address), "isRebalancer": indexed(p.bool)}),
    LogUpdateSecondaryAuth: event("0xf7d4305c2484fc33da12fa2d5e60115ddddcad067a6947f8768af861a69991e5", "LogUpdateSecondaryAuth(address,address)", {"oldSecondaryAuth": indexed(p.address), "secondaryAuth": indexed(p.address)}),
    LogUpdateTreasury: event("0x47b97c2d9ab240508b648a221f898595b464d23a20e6275f57059f97b38709af", "LogUpdateTreasury(address,address)", {"oldTreasury": indexed(p.address), "newTreasury": indexed(p.address)}),
    LogVaultToProtocolDeposit: event("0x75c44288c79c5a5de8e2fa5c842bd59f39da0055d45a641d751c85ef7d032c2e", "LogVaultToProtocolDeposit(uint8,uint256)", {"protocol": indexed(p.uint8), "depositAmount": p.uint256}),
    LogWethPayback: event("0xf4110722f70cfc53e334bfe597413f0ed538c5d6155e5f58dcc593432004792d", "LogWethPayback(uint256,uint256)", {"amount": indexed(p.uint256), "protocolId": indexed(p.uint256)}),
    LogWethSweep: event("0x60776ca601697e84aba5f1badc7d84016b1fe0b37c78e4dbe6fa2153744a48b5", "LogWethSweep(uint256)", {"wethAmount": p.uint256}),
    LogWethSweepToWeEth: event("0xef26c6c5bc001ac44325ca2f9eb8cbdef00401aa619ee0f33d0d125f7465e483", "LogWethSweepToWeEth(uint256)", {"wethAmount": p.uint256}),
    LogWithdrawFeeCollected: event("0xdefeeb60c1a350e80647fd558b9ea3909f5acd9f66d28e6f5d226cdd30ee2c62", "LogWithdrawFeeCollected(address,uint256)", {"payer": indexed(p.address), "fee": indexed(p.uint256)}),
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", {"from": indexed(p.address), "to": indexed(p.address), "value": p.uint256}),
    Withdraw: event("0xfbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db", "Withdraw(address,address,address,uint256,uint256)", {"sender": indexed(p.address), "receiver": indexed(p.address), "owner": indexed(p.address), "assets": p.uint256, "shares": p.uint256}),
}

export const functions = {
    addDSAAuth: fun("0x590ee346", "addDSAAuth(address)", {"auth_": p.address}, ),
    aggrMaxVaultRatio: viewFun("0x7b63f4be", "aggrMaxVaultRatio()", {}, p.uint256),
    allocationToTeamMultisig: viewFun("0x36b98dd7", "allocationToTeamMultisig()", {}, p.uint256),
    allowance: viewFun("0xdd62ed3e", "allowance(address,address)", {"owner": p.address, "spender": p.address}, p.uint256),
    approve: fun("0x095ea7b3", "approve(address,uint256)", {"spender": p.address, "amount": p.uint256}, p.bool),
    asset: viewFun("0x38d52e0f", "asset()", {}, p.address),
    balanceOf: viewFun("0x70a08231", "balanceOf(address)", {"account": p.address}, p.uint256),
    changeVaultStatus: fun("0x9febd9c0", "changeVaultStatus(uint8)", {"status_": p.uint8}, ),
    claimEthWithdrawal: fun("0x9b47a13a", "claimEthWithdrawal(uint256,uint8)", {"requestId_": p.uint256, "toProtocolId_": p.uint8}, ),
    claimFromAaveV3Lido: fun("0xec0684cd", "claimFromAaveV3Lido()", {}, ),
    claimFromSpark: fun("0x3a9fb289", "claimFromSpark()", {}, ),
    claimKingRewards: fun("0xe5c0a923", "claimKingRewards(address,uint256,bytes32,bytes32[],uint256)", {"merkleContract_": p.address, "amount_": p.uint256, "expectedMerkleRoot_": p.bytes32, "merkleProof_": p.array(p.bytes32), "setId_": p.uint256}, ),
    claimSteth: fun("0xfcda7e94", "claimSteth(uint256)", {"fromNftID_": p.uint256}, p.uint256),
    claimStethAndPaybackFluid: fun("0xc74c80f1", "claimStethAndPaybackFluid(uint256)", {"fromNftID_": p.uint256}, p.uint256),
    collectRevenue: fun("0xbadfd3a7", "collectRevenue(uint256)", {"amount_": p.uint256}, ),
    convertAaveV3wstETHToWeETH: fun("0x0020ab57", "convertAaveV3wstETHToWeETH(uint256,uint256,uint256)", {"wEthFlashloanAmount_": p.uint256, "wstEthWithdrawAmount_": p.uint256, "route_": p.uint256}, ),
    convertToAssets: viewFun("0x07a2d13a", "convertToAssets(uint256)", {"shares": p.uint256}, p.uint256),
    convertToShares: viewFun("0xc6e6f592", "convertToShares(uint256)", {"assets": p.uint256}, p.uint256),
    decimals: viewFun("0x313ce567", "decimals()", {}, p.uint8),
    decreaseAllowance: fun("0xa457c2d7", "decreaseAllowance(address,uint256)", {"spender": p.address, "subtractedValue": p.uint256}, p.bool),
    deposit: fun("0x6e553f65", "deposit(uint256,address)", {"assets_": p.uint256, "receiver_": p.address}, p.uint256),
    enableAaveV3LidoEMode: fun("0x648ae39b", "enableAaveV3LidoEMode()", {}, ),
    exchangePrice: viewFun("0x9e65741e", "exchangePrice()", {}, p.uint256),
    fillVaultAvailability: fun("0x3352040e", "fillVaultAvailability(uint8,uint256)", {"protocolId_": p.uint8, "withdrawAmount_": p.uint256}, ),
    fluidDexNFT: viewFun("0x6c44af91", "fluidDexNFT()", {}, p.uint256),
    getNetAssets: viewFun("0x08bb5fb0", "getNetAssets()", {}, {"totalAssets_": p.uint256, "totalDebt_": p.uint256, "netAssets_": p.uint256, "aggregatedRatio_": p.uint256, "assets_": p.struct({"aaveV3": p.struct({"wstETH": p.uint256, "weETH": p.uint256, "eETH": p.uint256, "stETH": p.uint256, "wETH": p.uint256}), "compoundV3": p.struct({"wstETH": p.uint256, "wETH": p.uint256}), "spark": p.struct({"wstETH": p.uint256, "wETH": p.uint256}), "fluidNew": p.struct({"wstETH": p.uint256, "wETH": p.uint256}), "aaveV3Lido": p.struct({"wstETH": p.uint256, "wETH": p.uint256}), "fluidDex": p.struct({"wstETHSupply": p.uint256, "ethSupply": p.uint256, "wstETHBorrow": p.uint256, "stETHBorrow": p.uint256, "ethBorrow": p.uint256}), "fluidWeETH": p.struct({"weETH": p.uint256, "wstETH": p.uint256, "eETH": p.uint256, "stETH": p.uint256}), "vaultBalances": p.struct({"stETH": p.uint256, "eETH": p.uint256, "weETH": p.uint256, "wstETH": p.uint256, "wETH": p.uint256}), "dsaBalances": p.struct({"stETH": p.uint256, "eETH": p.uint256, "weETH": p.uint256, "wstETH": p.uint256, "wETH": p.uint256})})}),
    getProtocolRatio: viewFun("0x3f6246f5", "getProtocolRatio(uint8)", {"protocolId_": p.uint8}, p.uint256),
    getRatioAaveV3: viewFun("0xad6296f5", "getRatioAaveV3(uint256,uint256)", {"eEthPerWeETH_": p.uint256, "stEthPerWsteth_": p.uint256}, {"wstEthAmount_": p.uint256, "weEthAmount_": p.uint256, "eEthAmount_": p.uint256, "stEthAmount_": p.uint256, "ethAmount_": p.uint256, "ratio_": p.uint256}),
    getRatioAaveV3Lido: viewFun("0xb63ddd45", "getRatioAaveV3Lido(uint256)", {"stEthPerWsteth_": p.uint256}, {"wstEthAmount_": p.uint256, "stEthAmount_": p.uint256, "ethAmount_": p.uint256, "ratio_": p.uint256}),
    getRatioCompoundV3: viewFun("0xa6474400", "getRatioCompoundV3(uint256)", {"stEthPerWsteth_": p.uint256}, {"wstEthAmount_": p.uint256, "stEthAmount_": p.uint256, "ethAmount_": p.uint256, "ratio_": p.uint256}),
    getRatioFluidDex: viewFun("0x5fe9e5b8", "getRatioFluidDex(uint256)", {"stEthPerWsteth_": p.uint256}, {"wstEthColAmount_": p.uint256, "stEthColAmount_": p.uint256, "ethColAmount_": p.uint256, "wstEthDebtAmount_": p.uint256, "stEthDebtAmount_": p.uint256, "ethDebtAmount_": p.uint256, "ratio_": p.uint256}),
    getRatioFluidNew: viewFun("0x072bb769", "getRatioFluidNew(uint256)", {"stEthPerWsteth_": p.uint256}, {"wstEthAmount_": p.uint256, "stEthAmount_": p.uint256, "ethAmount_": p.uint256, "ratio_": p.uint256}),
    getRatioFluidWeETHWstETH: viewFun("0xba813abd", "getRatioFluidWeETHWstETH(uint256,uint256)", {"eEthPerWeETH_": p.uint256, "stEthPerWsteth_": p.uint256}, {"weEthAmount_": p.uint256, "wstEthAmount_": p.uint256, "eEthAmount_": p.uint256, "stEthAmount_": p.uint256, "ratio_": p.uint256}),
    getRatioSpark: viewFun("0xbbc6f37e", "getRatioSpark(uint256)", {"stEthPerWsteth_": p.uint256}, {"wstEthAmount_": p.uint256, "stEthAmount_": p.uint256, "ethAmount_": p.uint256, "ratio_": p.uint256}),
    getWithdrawFee: viewFun("0x29c23e4a", "getWithdrawFee(uint256)", {"stETHAmount_": p.uint256}, p.uint256),
    increaseAllowance: fun("0x39509351", "increaseAllowance(address,uint256)", {"spender": p.address, "addedValue": p.uint256}, p.bool),
    isRebalancer: viewFun("0x467c9eff", "isRebalancer(address)", {"_0": p.address}, p.bool),
    leverage: fun("0x71aec968", "leverage(uint8,uint256,uint256,uint256,address[],uint256[],uint256,string[],bytes[],uint256)", {"protocolId_": p.uint8, "route_": p.uint256, "wstETHflashAmount_": p.uint256, "wETHBorrowAmount_": p.uint256, "vaults_": p.array(p.address), "vaultAmounts_": p.array(p.uint256), "swapMode_": p.uint256, "_swapConnectors": p.array(p.string), "_swapDatas": p.array(p.bytes), "unitAmount_": p.uint256}, ),
    leverageDexRefinance: fun("0xb4cd87e8", "leverageDexRefinance(uint8,uint256,uint256,uint256,uint256,int256,int256,int256,int256,int256,int256)", {"protocolId_": p.uint8, "route_": p.uint256, "wstETHflashAmount_": p.uint256, "wETHBorrowAmount_": p.uint256, "withdrawAmount_": p.uint256, "perfectColShares_": p.int256, "colToken0MinMax_": p.int256, "colToken1MinMax_": p.int256, "perfectDebtShares_": p.int256, "debtToken0MinMax_": p.int256, "debtToken1MinMax_": p.int256}, {"ratioFromProtocol_": p.uint256, "ratioToProtocol_": p.uint256}),
    leverageMaxUnitAmountLimit: viewFun("0xaa483aca", "leverageMaxUnitAmountLimit()", {}, p.uint256),
    maxAllocationToTeamMultisig: viewFun("0x047d2851", "maxAllocationToTeamMultisig()", {}, p.uint256),
    maxDeposit: viewFun("0x402d267d", "maxDeposit(address)", {"_0": p.address}, p.uint256),
    maxMint: viewFun("0xc63d75b6", "maxMint(address)", {"_0": p.address}, p.uint256),
    maxRedeem: viewFun("0xd905777e", "maxRedeem(address)", {"owner": p.address}, p.uint256),
    maxRiskRatio: viewFun("0xc0e48831", "maxRiskRatio(uint8)", {"_0": p.uint8}, p.uint256),
    maxWithdraw: viewFun("0xce96cb77", "maxWithdraw(address)", {"owner": p.address}, p.uint256),
    mint: fun("0x94bf804d", "mint(uint256,address)", {"shares_": p.uint256, "receiver_": p.address}, p.uint256),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    onERC721Received: fun("0x150b7a02", "onERC721Received(address,address,uint256,bytes)", {"_0": p.address, "_1": p.address, "_2": p.uint256, "_3": p.bytes}, p.bytes4),
    paybackDebt: fun("0x05e3b282", "paybackDebt(uint8)", {"toProtocolId_": p.uint8}, ),
    previewDeposit: viewFun("0xef8b30f7", "previewDeposit(uint256)", {"assets": p.uint256}, p.uint256),
    previewMint: viewFun("0xb3d7f6b9", "previewMint(uint256)", {"shares": p.uint256}, p.uint256),
    previewRedeem: viewFun("0x4cdad506", "previewRedeem(uint256)", {"shares": p.uint256}, p.uint256),
    previewWithdraw: viewFun("0x0a28a477", "previewWithdraw(uint256)", {"assets": p.uint256}, p.uint256),
    queueSteth: fun("0x7e2efbf5", "queueSteth(uint8,uint256,uint256,uint256)", {"fromProtocolId_": p.uint8, "route_": p.uint256, "wETHBorrowAmount_": p.uint256, "withdrawStethAmount_": p.uint256}, p.uint256),
    queuedWithdrawStEth: viewFun("0x2203c6cc", "queuedWithdrawStEth()", {}, p.uint256),
    readFromStorage: viewFun("0xb5c736e4", "readFromStorage(bytes32)", {"slot_": p.bytes32}, p.uint256),
    rebalanceFromWeETHToWstETH: fun("0x7e0b9fe7", "rebalanceFromWeETHToWstETH(uint256,uint256,uint256)", {"weEthFlashloanAmount_": p.uint256, "wstEthBorrowAmount_": p.uint256, "route_": p.uint256}, ),
    rebalanceFromWstETHToWeETH: fun("0x7210ca87", "rebalanceFromWstETHToWeETH(uint256,uint256,uint256)", {"wstEthFlashloanAmount_": p.uint256, "weEthWithdrawAmount_": p.uint256, "route_": p.uint256}, ),
    redeem: fun("0xba087652", "redeem(uint256,address,address)", {"shares_": p.uint256, "receiver_": p.address, "owner_": p.address}, p.uint256),
    reduceAggrMaxVaultRatio: fun("0x1d1583b4", "reduceAggrMaxVaultRatio(uint256)", {"newAggrMaxVaultRatio_": p.uint256}, ),
    reduceMaxRiskRatio: fun("0x032e9afc", "reduceMaxRiskRatio(uint8[],uint256[])", {"protocolId_": p.array(p.uint8), "newRiskRatio_": p.array(p.uint256)}, ),
    refinance: fun("0x1c7697e5", "refinance(uint8,uint8,uint256,uint256,uint256,uint256)", {"fromProtocolId_": p.uint8, "toProtocolId_": p.uint8, "route_": p.uint256, "wstETHflashAmount_": p.uint256, "wETHBorrowAmount_": p.uint256, "withdrawAmount_": p.uint256}, {"ratioFromProtocol_": p.uint256, "ratioToProtocol_": p.uint256}),
    revenue: viewFun("0x3e9491a2", "revenue()", {}, p.uint256),
    revenueExchangePrice: viewFun("0x98e1862c", "revenueExchangePrice()", {}, p.uint256),
    revenueFeePercentage: viewFun("0x3c057964", "revenueFeePercentage()", {}, p.uint256),
    secondaryAuth: viewFun("0x32056f9d", "secondaryAuth()", {}, p.address),
    setFluidDexNftId: fun("0x79b7622e", "setFluidDexNftId(uint256)", {"nftID_": p.uint256}, ),
    spell: fun("0x15ff627d", "spell(address,bytes,uint256,uint256)", {"to_": p.address, "calldata_": p.bytes, "value_": p.uint256, "operation_": p.uint256}, ),
    swapKingTokensToWeth: fun("0x97c8b4db", "swapKingTokensToWeth(uint256,uint256,string,bytes)", {"sellAmount_": p.uint256, "unitAmount_": p.uint256, "swapConnectorName_": p.string, "swapCallData_": p.bytes}, ),
    swapWeETHToWstETH: fun("0xf0fefc66", "swapWeETHToWstETH(uint256,uint256,uint256,string,bytes)", {"weEthSellAmount_": p.uint256, "unitAmount_": p.uint256, "route_": p.uint256, "swapConnectorName_": p.string, "swapCallData_": p.bytes}, ),
    swapWstETHToWeETH: fun("0x2aaa3e6c", "swapWstETHToWeETH(uint256,uint256,uint256,string,bytes)", {"wstEthSellAmount_": p.uint256, "unitAmount_": p.uint256, "route_": p.uint256, "swapConnectorName_": p.string, "swapCallData_": p.bytes}, ),
    sweepEthToSteth: fun("0x097c996b", "sweepEthToSteth()", {}, ),
    sweepWethToSteth: fun("0x206a7df6", "sweepWethToSteth()", {}, ),
    sweepWethToWeEth: fun("0xc39d5cfa", "sweepWethToWeEth()", {}, ),
    symbol: viewFun("0x95d89b41", "symbol()", {}, p.string),
    totalAssets: viewFun("0x01e1d114", "totalAssets()", {}, p.uint256),
    totalSupply: viewFun("0x18160ddd", "totalSupply()", {}, p.uint256),
    transfer: fun("0xa9059cbb", "transfer(address,uint256)", {"to": p.address, "amount": p.uint256}, p.bool),
    transferFrom: fun("0x23b872dd", "transferFrom(address,address,uint256)", {"from": p.address, "to": p.address, "amount": p.uint256}, p.bool),
    transferKingTokensToTeamMS: fun("0x84d5f112", "transferKingTokensToTeamMS(uint256)", {"amount_": p.uint256}, ),
    treasury: viewFun("0x61d027b3", "treasury()", {}, p.address),
    unwindDexRefinance: fun("0xabe09ee9", "unwindDexRefinance(uint8,uint256,uint256,uint256,uint256,int256,int256,int256,int256,int256,int256)", {"protocolId_": p.uint8, "route_": p.uint256, "wstETHflashAmount_": p.uint256, "wETHPaybackAmount_": p.uint256, "withdrawAmount_": p.uint256, "perfectColShares_": p.int256, "colToken0MinMax_": p.int256, "colToken1MinMax_": p.int256, "perfectDebtShares_": p.int256, "debtToken0MinMax_": p.int256, "debtToken1MinMax_": p.int256}, {"ratioFromProtocol_": p.uint256, "ratioToProtocol_": p.uint256}),
    updateAggrMaxVaultRatio: fun("0x7dc7b239", "updateAggrMaxVaultRatio(uint256)", {"newAggrMaxVaultRatio_": p.uint256}, ),
    updateExchangePrice: fun("0x3bfaa7e3", "updateExchangePrice()", {}, {"newExchangePrice_": p.uint256, "newRevenue_": p.uint256}),
    updateFees: fun("0x22429085", "updateFees(uint256,uint256,uint256)", {"revenueFeePercent_": p.uint256, "withdrawalFeePercent_": p.uint256, "withdrawFeeAbsoluteMin_": p.uint256}, ),
    updateLeverageMaxUnitAmountLimit: fun("0x300dd069", "updateLeverageMaxUnitAmountLimit(uint256)", {"newLimit_": p.uint256}, ),
    updateMaxRiskRatio: fun("0x3d639d98", "updateMaxRiskRatio(uint8[],uint256[])", {"protocolId_": p.array(p.uint8), "newRiskRatio_": p.array(p.uint256)}, ),
    updateRebalancer: fun("0x0de30836", "updateRebalancer(address,bool)", {"rebalancer_": p.address, "isRebalancer_": p.bool}, ),
    updateSecondaryAuth: fun("0x291c8e7e", "updateSecondaryAuth(address)", {"secondaryAuth_": p.address}, ),
    updateTreasury: fun("0x7f51bb1f", "updateTreasury(address)", {"newTreasury_": p.address}, ),
    vaultDSA: viewFun("0xef5c2d99", "vaultDSA()", {}, p.address),
    vaultToProtocolDeposit: fun("0x706fd5ae", "vaultToProtocolDeposit(uint8,uint256)", {"protocolId_": p.uint8, "depositAmount_": p.uint256}, ),
    withdraw: fun("0xb460af94", "withdraw(uint256,address,address)", {"assets_": p.uint256, "receiver_": p.address, "owner_": p.address}, p.uint256),
    withdrawFeeAbsoluteMin: viewFun("0xf104d7d4", "withdrawFeeAbsoluteMin()", {}, p.uint256),
    withdrawalFeePercentage: viewFun("0x78922c8f", "withdrawalFeePercentage()", {}, p.uint256),
}

export class Contract extends ContractBase {

    aggrMaxVaultRatio() {
        return this.eth_call(functions.aggrMaxVaultRatio, {})
    }

    allocationToTeamMultisig() {
        return this.eth_call(functions.allocationToTeamMultisig, {})
    }

    allowance(owner: AllowanceParams["owner"], spender: AllowanceParams["spender"]) {
        return this.eth_call(functions.allowance, {owner, spender})
    }

    asset() {
        return this.eth_call(functions.asset, {})
    }

    balanceOf(account: BalanceOfParams["account"]) {
        return this.eth_call(functions.balanceOf, {account})
    }

    convertToAssets(shares: ConvertToAssetsParams["shares"]) {
        return this.eth_call(functions.convertToAssets, {shares})
    }

    convertToShares(assets: ConvertToSharesParams["assets"]) {
        return this.eth_call(functions.convertToShares, {assets})
    }

    decimals() {
        return this.eth_call(functions.decimals, {})
    }

    exchangePrice() {
        return this.eth_call(functions.exchangePrice, {})
    }

    fluidDexNFT() {
        return this.eth_call(functions.fluidDexNFT, {})
    }

    getNetAssets() {
        return this.eth_call(functions.getNetAssets, {})
    }

    getProtocolRatio(protocolId_: GetProtocolRatioParams["protocolId_"]) {
        return this.eth_call(functions.getProtocolRatio, {protocolId_})
    }

    getRatioAaveV3(eEthPerWeETH_: GetRatioAaveV3Params["eEthPerWeETH_"], stEthPerWsteth_: GetRatioAaveV3Params["stEthPerWsteth_"]) {
        return this.eth_call(functions.getRatioAaveV3, {eEthPerWeETH_, stEthPerWsteth_})
    }

    getRatioAaveV3Lido(stEthPerWsteth_: GetRatioAaveV3LidoParams["stEthPerWsteth_"]) {
        return this.eth_call(functions.getRatioAaveV3Lido, {stEthPerWsteth_})
    }

    getRatioCompoundV3(stEthPerWsteth_: GetRatioCompoundV3Params["stEthPerWsteth_"]) {
        return this.eth_call(functions.getRatioCompoundV3, {stEthPerWsteth_})
    }

    getRatioFluidDex(stEthPerWsteth_: GetRatioFluidDexParams["stEthPerWsteth_"]) {
        return this.eth_call(functions.getRatioFluidDex, {stEthPerWsteth_})
    }

    getRatioFluidNew(stEthPerWsteth_: GetRatioFluidNewParams["stEthPerWsteth_"]) {
        return this.eth_call(functions.getRatioFluidNew, {stEthPerWsteth_})
    }

    getRatioFluidWeETHWstETH(eEthPerWeETH_: GetRatioFluidWeETHWstETHParams["eEthPerWeETH_"], stEthPerWsteth_: GetRatioFluidWeETHWstETHParams["stEthPerWsteth_"]) {
        return this.eth_call(functions.getRatioFluidWeETHWstETH, {eEthPerWeETH_, stEthPerWsteth_})
    }

    getRatioSpark(stEthPerWsteth_: GetRatioSparkParams["stEthPerWsteth_"]) {
        return this.eth_call(functions.getRatioSpark, {stEthPerWsteth_})
    }

    getWithdrawFee(stETHAmount_: GetWithdrawFeeParams["stETHAmount_"]) {
        return this.eth_call(functions.getWithdrawFee, {stETHAmount_})
    }

    isRebalancer(_0: IsRebalancerParams["_0"]) {
        return this.eth_call(functions.isRebalancer, {_0})
    }

    leverageMaxUnitAmountLimit() {
        return this.eth_call(functions.leverageMaxUnitAmountLimit, {})
    }

    maxAllocationToTeamMultisig() {
        return this.eth_call(functions.maxAllocationToTeamMultisig, {})
    }

    maxDeposit(_0: MaxDepositParams["_0"]) {
        return this.eth_call(functions.maxDeposit, {_0})
    }

    maxMint(_0: MaxMintParams["_0"]) {
        return this.eth_call(functions.maxMint, {_0})
    }

    maxRedeem(owner: MaxRedeemParams["owner"]) {
        return this.eth_call(functions.maxRedeem, {owner})
    }

    maxRiskRatio(_0: MaxRiskRatioParams["_0"]) {
        return this.eth_call(functions.maxRiskRatio, {_0})
    }

    maxWithdraw(owner: MaxWithdrawParams["owner"]) {
        return this.eth_call(functions.maxWithdraw, {owner})
    }

    name() {
        return this.eth_call(functions.name, {})
    }

    previewDeposit(assets: PreviewDepositParams["assets"]) {
        return this.eth_call(functions.previewDeposit, {assets})
    }

    previewMint(shares: PreviewMintParams["shares"]) {
        return this.eth_call(functions.previewMint, {shares})
    }

    previewRedeem(shares: PreviewRedeemParams["shares"]) {
        return this.eth_call(functions.previewRedeem, {shares})
    }

    previewWithdraw(assets: PreviewWithdrawParams["assets"]) {
        return this.eth_call(functions.previewWithdraw, {assets})
    }

    queuedWithdrawStEth() {
        return this.eth_call(functions.queuedWithdrawStEth, {})
    }

    readFromStorage(slot_: ReadFromStorageParams["slot_"]) {
        return this.eth_call(functions.readFromStorage, {slot_})
    }

    revenue() {
        return this.eth_call(functions.revenue, {})
    }

    revenueExchangePrice() {
        return this.eth_call(functions.revenueExchangePrice, {})
    }

    revenueFeePercentage() {
        return this.eth_call(functions.revenueFeePercentage, {})
    }

    secondaryAuth() {
        return this.eth_call(functions.secondaryAuth, {})
    }

    symbol() {
        return this.eth_call(functions.symbol, {})
    }

    totalAssets() {
        return this.eth_call(functions.totalAssets, {})
    }

    totalSupply() {
        return this.eth_call(functions.totalSupply, {})
    }

    treasury() {
        return this.eth_call(functions.treasury, {})
    }

    vaultDSA() {
        return this.eth_call(functions.vaultDSA, {})
    }

    withdrawFeeAbsoluteMin() {
        return this.eth_call(functions.withdrawFeeAbsoluteMin, {})
    }

    withdrawalFeePercentage() {
        return this.eth_call(functions.withdrawalFeePercentage, {})
    }
}

/// Event types
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type DepositEventArgs = EParams<typeof events.Deposit>
export type LogChangeStatusEventArgs = EParams<typeof events.LogChangeStatus>
export type LogClaimEthWithdrawalEventArgs = EParams<typeof events.LogClaimEthWithdrawal>
export type LogClaimFromAaveV3LidoEventArgs = EParams<typeof events.LogClaimFromAaveV3Lido>
export type LogClaimFromKingEventArgs = EParams<typeof events.LogClaimFromKing>
export type LogClaimFromSparkEventArgs = EParams<typeof events.LogClaimFromSpark>
export type LogClaimStethEventArgs = EParams<typeof events.LogClaimSteth>
export type LogClaimStethAndPaybackFluidEventArgs = EParams<typeof events.LogClaimStethAndPaybackFluid>
export type LogCollectRevenueEventArgs = EParams<typeof events.LogCollectRevenue>
export type LogConvertAaveV3wstETHToWeETHEventArgs = EParams<typeof events.LogConvertAaveV3wstETHToWeETH>
export type LogEthSweepEventArgs = EParams<typeof events.LogEthSweep>
export type LogFillVaultAvailabilityEventArgs = EParams<typeof events.LogFillVaultAvailability>
export type LogLeverageEventArgs = EParams<typeof events.LogLeverage>
export type LogLeverageDexRefinanceEventArgs = EParams<typeof events.LogLeverageDexRefinance>
export type LogQueueStethEventArgs = EParams<typeof events.LogQueueSteth>
export type LogRebalanceFromWeETHToWstETHEventArgs = EParams<typeof events.LogRebalanceFromWeETHToWstETH>
export type LogRebalanceFromWstETHToWeETHEventArgs = EParams<typeof events.LogRebalanceFromWstETHToWeETH>
export type LogRefinanceEventArgs = EParams<typeof events.LogRefinance>
export type LogSwapKingTokensToWethEventArgs = EParams<typeof events.LogSwapKingTokensToWeth>
export type LogSwapWeETHToWstETHEventArgs = EParams<typeof events.LogSwapWeETHToWstETH>
export type LogSwapWstETHToWeETHEventArgs = EParams<typeof events.LogSwapWstETHToWeETH>
export type LogTransferKingTokensToTeamMSEventArgs = EParams<typeof events.LogTransferKingTokensToTeamMS>
export type LogUnwindDexRefinanceEventArgs = EParams<typeof events.LogUnwindDexRefinance>
export type LogUpdateAggrMaxVaultRatioEventArgs = EParams<typeof events.LogUpdateAggrMaxVaultRatio>
export type LogUpdateExchangePriceEventArgs = EParams<typeof events.LogUpdateExchangePrice>
export type LogUpdateFeesEventArgs = EParams<typeof events.LogUpdateFees>
export type LogUpdateLeverageMaxUnitAmountLimitEventArgs = EParams<typeof events.LogUpdateLeverageMaxUnitAmountLimit>
export type LogUpdateMaxRiskRatioEventArgs = EParams<typeof events.LogUpdateMaxRiskRatio>
export type LogUpdateRebalancerEventArgs = EParams<typeof events.LogUpdateRebalancer>
export type LogUpdateSecondaryAuthEventArgs = EParams<typeof events.LogUpdateSecondaryAuth>
export type LogUpdateTreasuryEventArgs = EParams<typeof events.LogUpdateTreasury>
export type LogVaultToProtocolDepositEventArgs = EParams<typeof events.LogVaultToProtocolDeposit>
export type LogWethPaybackEventArgs = EParams<typeof events.LogWethPayback>
export type LogWethSweepEventArgs = EParams<typeof events.LogWethSweep>
export type LogWethSweepToWeEthEventArgs = EParams<typeof events.LogWethSweepToWeEth>
export type LogWithdrawFeeCollectedEventArgs = EParams<typeof events.LogWithdrawFeeCollected>
export type TransferEventArgs = EParams<typeof events.Transfer>
export type WithdrawEventArgs = EParams<typeof events.Withdraw>

/// Function types
export type AddDSAAuthParams = FunctionArguments<typeof functions.addDSAAuth>
export type AddDSAAuthReturn = FunctionReturn<typeof functions.addDSAAuth>

export type AggrMaxVaultRatioParams = FunctionArguments<typeof functions.aggrMaxVaultRatio>
export type AggrMaxVaultRatioReturn = FunctionReturn<typeof functions.aggrMaxVaultRatio>

export type AllocationToTeamMultisigParams = FunctionArguments<typeof functions.allocationToTeamMultisig>
export type AllocationToTeamMultisigReturn = FunctionReturn<typeof functions.allocationToTeamMultisig>

export type AllowanceParams = FunctionArguments<typeof functions.allowance>
export type AllowanceReturn = FunctionReturn<typeof functions.allowance>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type AssetParams = FunctionArguments<typeof functions.asset>
export type AssetReturn = FunctionReturn<typeof functions.asset>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type ChangeVaultStatusParams = FunctionArguments<typeof functions.changeVaultStatus>
export type ChangeVaultStatusReturn = FunctionReturn<typeof functions.changeVaultStatus>

export type ClaimEthWithdrawalParams = FunctionArguments<typeof functions.claimEthWithdrawal>
export type ClaimEthWithdrawalReturn = FunctionReturn<typeof functions.claimEthWithdrawal>

export type ClaimFromAaveV3LidoParams = FunctionArguments<typeof functions.claimFromAaveV3Lido>
export type ClaimFromAaveV3LidoReturn = FunctionReturn<typeof functions.claimFromAaveV3Lido>

export type ClaimFromSparkParams = FunctionArguments<typeof functions.claimFromSpark>
export type ClaimFromSparkReturn = FunctionReturn<typeof functions.claimFromSpark>

export type ClaimKingRewardsParams = FunctionArguments<typeof functions.claimKingRewards>
export type ClaimKingRewardsReturn = FunctionReturn<typeof functions.claimKingRewards>

export type ClaimStethParams = FunctionArguments<typeof functions.claimSteth>
export type ClaimStethReturn = FunctionReturn<typeof functions.claimSteth>

export type ClaimStethAndPaybackFluidParams = FunctionArguments<typeof functions.claimStethAndPaybackFluid>
export type ClaimStethAndPaybackFluidReturn = FunctionReturn<typeof functions.claimStethAndPaybackFluid>

export type CollectRevenueParams = FunctionArguments<typeof functions.collectRevenue>
export type CollectRevenueReturn = FunctionReturn<typeof functions.collectRevenue>

export type ConvertAaveV3wstETHToWeETHParams = FunctionArguments<typeof functions.convertAaveV3wstETHToWeETH>
export type ConvertAaveV3wstETHToWeETHReturn = FunctionReturn<typeof functions.convertAaveV3wstETHToWeETH>

export type ConvertToAssetsParams = FunctionArguments<typeof functions.convertToAssets>
export type ConvertToAssetsReturn = FunctionReturn<typeof functions.convertToAssets>

export type ConvertToSharesParams = FunctionArguments<typeof functions.convertToShares>
export type ConvertToSharesReturn = FunctionReturn<typeof functions.convertToShares>

export type DecimalsParams = FunctionArguments<typeof functions.decimals>
export type DecimalsReturn = FunctionReturn<typeof functions.decimals>

export type DecreaseAllowanceParams = FunctionArguments<typeof functions.decreaseAllowance>
export type DecreaseAllowanceReturn = FunctionReturn<typeof functions.decreaseAllowance>

export type DepositParams = FunctionArguments<typeof functions.deposit>
export type DepositReturn = FunctionReturn<typeof functions.deposit>

export type EnableAaveV3LidoEModeParams = FunctionArguments<typeof functions.enableAaveV3LidoEMode>
export type EnableAaveV3LidoEModeReturn = FunctionReturn<typeof functions.enableAaveV3LidoEMode>

export type ExchangePriceParams = FunctionArguments<typeof functions.exchangePrice>
export type ExchangePriceReturn = FunctionReturn<typeof functions.exchangePrice>

export type FillVaultAvailabilityParams = FunctionArguments<typeof functions.fillVaultAvailability>
export type FillVaultAvailabilityReturn = FunctionReturn<typeof functions.fillVaultAvailability>

export type FluidDexNFTParams = FunctionArguments<typeof functions.fluidDexNFT>
export type FluidDexNFTReturn = FunctionReturn<typeof functions.fluidDexNFT>

export type GetNetAssetsParams = FunctionArguments<typeof functions.getNetAssets>
export type GetNetAssetsReturn = FunctionReturn<typeof functions.getNetAssets>

export type GetProtocolRatioParams = FunctionArguments<typeof functions.getProtocolRatio>
export type GetProtocolRatioReturn = FunctionReturn<typeof functions.getProtocolRatio>

export type GetRatioAaveV3Params = FunctionArguments<typeof functions.getRatioAaveV3>
export type GetRatioAaveV3Return = FunctionReturn<typeof functions.getRatioAaveV3>

export type GetRatioAaveV3LidoParams = FunctionArguments<typeof functions.getRatioAaveV3Lido>
export type GetRatioAaveV3LidoReturn = FunctionReturn<typeof functions.getRatioAaveV3Lido>

export type GetRatioCompoundV3Params = FunctionArguments<typeof functions.getRatioCompoundV3>
export type GetRatioCompoundV3Return = FunctionReturn<typeof functions.getRatioCompoundV3>

export type GetRatioFluidDexParams = FunctionArguments<typeof functions.getRatioFluidDex>
export type GetRatioFluidDexReturn = FunctionReturn<typeof functions.getRatioFluidDex>

export type GetRatioFluidNewParams = FunctionArguments<typeof functions.getRatioFluidNew>
export type GetRatioFluidNewReturn = FunctionReturn<typeof functions.getRatioFluidNew>

export type GetRatioFluidWeETHWstETHParams = FunctionArguments<typeof functions.getRatioFluidWeETHWstETH>
export type GetRatioFluidWeETHWstETHReturn = FunctionReturn<typeof functions.getRatioFluidWeETHWstETH>

export type GetRatioSparkParams = FunctionArguments<typeof functions.getRatioSpark>
export type GetRatioSparkReturn = FunctionReturn<typeof functions.getRatioSpark>

export type GetWithdrawFeeParams = FunctionArguments<typeof functions.getWithdrawFee>
export type GetWithdrawFeeReturn = FunctionReturn<typeof functions.getWithdrawFee>

export type IncreaseAllowanceParams = FunctionArguments<typeof functions.increaseAllowance>
export type IncreaseAllowanceReturn = FunctionReturn<typeof functions.increaseAllowance>

export type IsRebalancerParams = FunctionArguments<typeof functions.isRebalancer>
export type IsRebalancerReturn = FunctionReturn<typeof functions.isRebalancer>

export type LeverageParams = FunctionArguments<typeof functions.leverage>
export type LeverageReturn = FunctionReturn<typeof functions.leverage>

export type LeverageDexRefinanceParams = FunctionArguments<typeof functions.leverageDexRefinance>
export type LeverageDexRefinanceReturn = FunctionReturn<typeof functions.leverageDexRefinance>

export type LeverageMaxUnitAmountLimitParams = FunctionArguments<typeof functions.leverageMaxUnitAmountLimit>
export type LeverageMaxUnitAmountLimitReturn = FunctionReturn<typeof functions.leverageMaxUnitAmountLimit>

export type MaxAllocationToTeamMultisigParams = FunctionArguments<typeof functions.maxAllocationToTeamMultisig>
export type MaxAllocationToTeamMultisigReturn = FunctionReturn<typeof functions.maxAllocationToTeamMultisig>

export type MaxDepositParams = FunctionArguments<typeof functions.maxDeposit>
export type MaxDepositReturn = FunctionReturn<typeof functions.maxDeposit>

export type MaxMintParams = FunctionArguments<typeof functions.maxMint>
export type MaxMintReturn = FunctionReturn<typeof functions.maxMint>

export type MaxRedeemParams = FunctionArguments<typeof functions.maxRedeem>
export type MaxRedeemReturn = FunctionReturn<typeof functions.maxRedeem>

export type MaxRiskRatioParams = FunctionArguments<typeof functions.maxRiskRatio>
export type MaxRiskRatioReturn = FunctionReturn<typeof functions.maxRiskRatio>

export type MaxWithdrawParams = FunctionArguments<typeof functions.maxWithdraw>
export type MaxWithdrawReturn = FunctionReturn<typeof functions.maxWithdraw>

export type MintParams = FunctionArguments<typeof functions.mint>
export type MintReturn = FunctionReturn<typeof functions.mint>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type OnERC721ReceivedParams = FunctionArguments<typeof functions.onERC721Received>
export type OnERC721ReceivedReturn = FunctionReturn<typeof functions.onERC721Received>

export type PaybackDebtParams = FunctionArguments<typeof functions.paybackDebt>
export type PaybackDebtReturn = FunctionReturn<typeof functions.paybackDebt>

export type PreviewDepositParams = FunctionArguments<typeof functions.previewDeposit>
export type PreviewDepositReturn = FunctionReturn<typeof functions.previewDeposit>

export type PreviewMintParams = FunctionArguments<typeof functions.previewMint>
export type PreviewMintReturn = FunctionReturn<typeof functions.previewMint>

export type PreviewRedeemParams = FunctionArguments<typeof functions.previewRedeem>
export type PreviewRedeemReturn = FunctionReturn<typeof functions.previewRedeem>

export type PreviewWithdrawParams = FunctionArguments<typeof functions.previewWithdraw>
export type PreviewWithdrawReturn = FunctionReturn<typeof functions.previewWithdraw>

export type QueueStethParams = FunctionArguments<typeof functions.queueSteth>
export type QueueStethReturn = FunctionReturn<typeof functions.queueSteth>

export type QueuedWithdrawStEthParams = FunctionArguments<typeof functions.queuedWithdrawStEth>
export type QueuedWithdrawStEthReturn = FunctionReturn<typeof functions.queuedWithdrawStEth>

export type ReadFromStorageParams = FunctionArguments<typeof functions.readFromStorage>
export type ReadFromStorageReturn = FunctionReturn<typeof functions.readFromStorage>

export type RebalanceFromWeETHToWstETHParams = FunctionArguments<typeof functions.rebalanceFromWeETHToWstETH>
export type RebalanceFromWeETHToWstETHReturn = FunctionReturn<typeof functions.rebalanceFromWeETHToWstETH>

export type RebalanceFromWstETHToWeETHParams = FunctionArguments<typeof functions.rebalanceFromWstETHToWeETH>
export type RebalanceFromWstETHToWeETHReturn = FunctionReturn<typeof functions.rebalanceFromWstETHToWeETH>

export type RedeemParams = FunctionArguments<typeof functions.redeem>
export type RedeemReturn = FunctionReturn<typeof functions.redeem>

export type ReduceAggrMaxVaultRatioParams = FunctionArguments<typeof functions.reduceAggrMaxVaultRatio>
export type ReduceAggrMaxVaultRatioReturn = FunctionReturn<typeof functions.reduceAggrMaxVaultRatio>

export type ReduceMaxRiskRatioParams = FunctionArguments<typeof functions.reduceMaxRiskRatio>
export type ReduceMaxRiskRatioReturn = FunctionReturn<typeof functions.reduceMaxRiskRatio>

export type RefinanceParams = FunctionArguments<typeof functions.refinance>
export type RefinanceReturn = FunctionReturn<typeof functions.refinance>

export type RevenueParams = FunctionArguments<typeof functions.revenue>
export type RevenueReturn = FunctionReturn<typeof functions.revenue>

export type RevenueExchangePriceParams = FunctionArguments<typeof functions.revenueExchangePrice>
export type RevenueExchangePriceReturn = FunctionReturn<typeof functions.revenueExchangePrice>

export type RevenueFeePercentageParams = FunctionArguments<typeof functions.revenueFeePercentage>
export type RevenueFeePercentageReturn = FunctionReturn<typeof functions.revenueFeePercentage>

export type SecondaryAuthParams = FunctionArguments<typeof functions.secondaryAuth>
export type SecondaryAuthReturn = FunctionReturn<typeof functions.secondaryAuth>

export type SetFluidDexNftIdParams = FunctionArguments<typeof functions.setFluidDexNftId>
export type SetFluidDexNftIdReturn = FunctionReturn<typeof functions.setFluidDexNftId>

export type SpellParams = FunctionArguments<typeof functions.spell>
export type SpellReturn = FunctionReturn<typeof functions.spell>

export type SwapKingTokensToWethParams = FunctionArguments<typeof functions.swapKingTokensToWeth>
export type SwapKingTokensToWethReturn = FunctionReturn<typeof functions.swapKingTokensToWeth>

export type SwapWeETHToWstETHParams = FunctionArguments<typeof functions.swapWeETHToWstETH>
export type SwapWeETHToWstETHReturn = FunctionReturn<typeof functions.swapWeETHToWstETH>

export type SwapWstETHToWeETHParams = FunctionArguments<typeof functions.swapWstETHToWeETH>
export type SwapWstETHToWeETHReturn = FunctionReturn<typeof functions.swapWstETHToWeETH>

export type SweepEthToStethParams = FunctionArguments<typeof functions.sweepEthToSteth>
export type SweepEthToStethReturn = FunctionReturn<typeof functions.sweepEthToSteth>

export type SweepWethToStethParams = FunctionArguments<typeof functions.sweepWethToSteth>
export type SweepWethToStethReturn = FunctionReturn<typeof functions.sweepWethToSteth>

export type SweepWethToWeEthParams = FunctionArguments<typeof functions.sweepWethToWeEth>
export type SweepWethToWeEthReturn = FunctionReturn<typeof functions.sweepWethToWeEth>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type TotalAssetsParams = FunctionArguments<typeof functions.totalAssets>
export type TotalAssetsReturn = FunctionReturn<typeof functions.totalAssets>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type TransferParams = FunctionArguments<typeof functions.transfer>
export type TransferReturn = FunctionReturn<typeof functions.transfer>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

export type TransferKingTokensToTeamMSParams = FunctionArguments<typeof functions.transferKingTokensToTeamMS>
export type TransferKingTokensToTeamMSReturn = FunctionReturn<typeof functions.transferKingTokensToTeamMS>

export type TreasuryParams = FunctionArguments<typeof functions.treasury>
export type TreasuryReturn = FunctionReturn<typeof functions.treasury>

export type UnwindDexRefinanceParams = FunctionArguments<typeof functions.unwindDexRefinance>
export type UnwindDexRefinanceReturn = FunctionReturn<typeof functions.unwindDexRefinance>

export type UpdateAggrMaxVaultRatioParams = FunctionArguments<typeof functions.updateAggrMaxVaultRatio>
export type UpdateAggrMaxVaultRatioReturn = FunctionReturn<typeof functions.updateAggrMaxVaultRatio>

export type UpdateExchangePriceParams = FunctionArguments<typeof functions.updateExchangePrice>
export type UpdateExchangePriceReturn = FunctionReturn<typeof functions.updateExchangePrice>

export type UpdateFeesParams = FunctionArguments<typeof functions.updateFees>
export type UpdateFeesReturn = FunctionReturn<typeof functions.updateFees>

export type UpdateLeverageMaxUnitAmountLimitParams = FunctionArguments<typeof functions.updateLeverageMaxUnitAmountLimit>
export type UpdateLeverageMaxUnitAmountLimitReturn = FunctionReturn<typeof functions.updateLeverageMaxUnitAmountLimit>

export type UpdateMaxRiskRatioParams = FunctionArguments<typeof functions.updateMaxRiskRatio>
export type UpdateMaxRiskRatioReturn = FunctionReturn<typeof functions.updateMaxRiskRatio>

export type UpdateRebalancerParams = FunctionArguments<typeof functions.updateRebalancer>
export type UpdateRebalancerReturn = FunctionReturn<typeof functions.updateRebalancer>

export type UpdateSecondaryAuthParams = FunctionArguments<typeof functions.updateSecondaryAuth>
export type UpdateSecondaryAuthReturn = FunctionReturn<typeof functions.updateSecondaryAuth>

export type UpdateTreasuryParams = FunctionArguments<typeof functions.updateTreasury>
export type UpdateTreasuryReturn = FunctionReturn<typeof functions.updateTreasury>

export type VaultDSAParams = FunctionArguments<typeof functions.vaultDSA>
export type VaultDSAReturn = FunctionReturn<typeof functions.vaultDSA>

export type VaultToProtocolDepositParams = FunctionArguments<typeof functions.vaultToProtocolDeposit>
export type VaultToProtocolDepositReturn = FunctionReturn<typeof functions.vaultToProtocolDeposit>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

export type WithdrawFeeAbsoluteMinParams = FunctionArguments<typeof functions.withdrawFeeAbsoluteMin>
export type WithdrawFeeAbsoluteMinReturn = FunctionReturn<typeof functions.withdrawFeeAbsoluteMin>

export type WithdrawalFeePercentageParams = FunctionArguments<typeof functions.withdrawalFeePercentage>
export type WithdrawalFeePercentageReturn = FunctionReturn<typeof functions.withdrawalFeePercentage>

