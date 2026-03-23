import {Codec, address, array, bool, f32, fixedArray, i32, i64, option, string, struct, sum, u128, u32, u64, u8, unit} from '@subsquid/borsh'

export type OracleType_None = undefined

export const OracleType_None = unit

export type OracleType_Test = undefined

export const OracleType_Test = unit

export type OracleType_Pyth = undefined

export const OracleType_Pyth = unit

export type OracleType = 
    | {
        kind: 'None'
        value?: OracleType_None
      }
    | {
        kind: 'Test'
        value?: OracleType_Test
      }
    | {
        kind: 'Pyth'
        value?: OracleType_Pyth
      }

export const OracleType: Codec<OracleType> = sum(1, {
    None: {
        discriminator: 0,
        value: OracleType_None,
    },
    Test: {
        discriminator: 1,
        value: OracleType_Test,
    },
    Pyth: {
        discriminator: 2,
        value: OracleType_Pyth,
    },
})

export interface OracleParams {
    oracleAccount: string
    oracleType: OracleType
    buffer: bigint
    maxPriceAgeSec: number
}

export const OracleParams: Codec<OracleParams> = struct({
    oracleAccount: address,
    oracleType: OracleType,
    buffer: u64,
    maxPriceAgeSec: u32,
})

export interface PricingParams {
    tradeImpactFeeScalar: bigint
    buffer: bigint
    swapSpread: bigint
    maxLeverage: bigint
    maxGlobalLongSizes: bigint
    maxGlobalShortSizes: bigint
}

export const PricingParams: Codec<PricingParams> = struct({
    tradeImpactFeeScalar: u64,
    buffer: u64,
    swapSpread: u64,
    maxLeverage: u64,
    maxGlobalLongSizes: u64,
    maxGlobalShortSizes: u64,
})

export interface Permissions {
    allowSwap: boolean
    allowAddLiquidity: boolean
    allowRemoveLiquidity: boolean
    allowIncreasePosition: boolean
    allowDecreasePosition: boolean
    allowCollateralWithdrawal: boolean
    allowLiquidatePosition: boolean
}

export const Permissions: Codec<Permissions> = struct({
    allowSwap: bool,
    allowAddLiquidity: bool,
    allowRemoveLiquidity: bool,
    allowIncreasePosition: bool,
    allowDecreasePosition: bool,
    allowCollateralWithdrawal: bool,
    allowLiquidatePosition: bool,
})

export interface JumpRateState {
    minRateBps: bigint
    maxRateBps: bigint
    targetRateBps: bigint
    targetUtilizationRate: bigint
}

export const JumpRateState: Codec<JumpRateState> = struct({
    minRateBps: u64,
    maxRateBps: u64,
    targetRateBps: u64,
    targetUtilizationRate: u64,
})

export interface AddCustodyParams {
    isStable: boolean
    oracle: OracleParams
    pricing: PricingParams
    permissions: Permissions
    hourlyFundingDbps: bigint
    targetRatioBps: bigint
    increasePositionBps: bigint
    decreasePositionBps: bigint
    dovesOracle: string
    maxPositionSizeUsd: bigint
    jumpRate: JumpRateState
    priceImpactFeeFactor: bigint
    priceImpactExponent: number
    deltaImbalanceThresholdDecimal: bigint
    maxFeeBps: bigint
    dovesAgOracle: string
}

export const AddCustodyParams: Codec<AddCustodyParams> = struct({
    isStable: bool,
    oracle: OracleParams,
    pricing: PricingParams,
    permissions: Permissions,
    hourlyFundingDbps: u64,
    targetRatioBps: u64,
    increasePositionBps: u64,
    decreasePositionBps: u64,
    dovesOracle: address,
    maxPositionSizeUsd: u64,
    jumpRate: JumpRateState,
    priceImpactFeeFactor: u64,
    priceImpactExponent: f32,
    deltaImbalanceThresholdDecimal: u64,
    maxFeeBps: u64,
    dovesAgOracle: address,
})

export interface AddLiquidity2Params {
    tokenAmountIn: bigint
    minLpAmountOut: bigint
    tokenAmountPreSwap?: bigint | undefined
}

export const AddLiquidity2Params: Codec<AddLiquidity2Params> = struct({
    tokenAmountIn: u64,
    minLpAmountOut: u64,
    tokenAmountPreSwap: option(u64),
})

export interface Limit {
    maxAumUsd: bigint
    tokenWeightageBufferBps: bigint
    buffer: bigint
}

export const Limit: Codec<Limit> = struct({
    maxAumUsd: u128,
    tokenWeightageBufferBps: u128,
    buffer: u64,
})

export interface Fees {
    swapMultiplier: bigint
    stableSwapMultiplier: bigint
    addRemoveLiquidityBps: bigint
    swapBps: bigint
    taxBps: bigint
    stableSwapBps: bigint
    stableSwapTaxBps: bigint
    liquidationRewardBps: bigint
    protocolShareBps: bigint
}

export const Fees: Codec<Fees> = struct({
    swapMultiplier: u64,
    stableSwapMultiplier: u64,
    addRemoveLiquidityBps: u64,
    swapBps: u64,
    taxBps: u64,
    stableSwapBps: u64,
    stableSwapTaxBps: u64,
    liquidationRewardBps: u64,
    protocolShareBps: u64,
})

export interface AddPoolParams {
    name: string
    limit: Limit
    fees: Fees
    maxRequestExecutionSec: bigint
}

export const AddPoolParams: Codec<AddPoolParams> = struct({
    name: string,
    limit: Limit,
    fees: Fees,
    maxRequestExecutionSec: i64,
})

export interface BorrowFromCustodyParams {
    amount: bigint
}

export const BorrowFromCustodyParams: Codec<BorrowFromCustodyParams> = struct({
    amount: u64,
})

export type CloseBorrowPositionParams = undefined

export const CloseBorrowPositionParams: Codec<CloseBorrowPositionParams> = unit

export interface CreateAndDelegateStakeAccountParams {
    stakeAccountIndex: bigint
    stakeAmountLamports: bigint
}

export const CreateAndDelegateStakeAccountParams: Codec<CreateAndDelegateStakeAccountParams> = struct({
    stakeAccountIndex: u64,
    stakeAmountLamports: u64,
})

export interface CreateDecreasePositionMarketRequestParams {
    collateralUsdDelta: bigint
    sizeUsdDelta: bigint
    priceSlippage: bigint
    jupiterMinimumOut?: bigint | undefined
    entirePosition?: boolean | undefined
    counter: bigint
}

export const CreateDecreasePositionMarketRequestParams: Codec<CreateDecreasePositionMarketRequestParams> = struct({
    collateralUsdDelta: u64,
    sizeUsdDelta: u64,
    priceSlippage: u64,
    jupiterMinimumOut: option(u64),
    entirePosition: option(bool),
    counter: u64,
})

export type RequestType_Market = undefined

export const RequestType_Market = unit

export type RequestType_Trigger = undefined

export const RequestType_Trigger = unit

export type RequestType = 
    | {
        kind: 'Market'
        value?: RequestType_Market
      }
    | {
        kind: 'Trigger'
        value?: RequestType_Trigger
      }

export const RequestType: Codec<RequestType> = sum(1, {
    Market: {
        discriminator: 0,
        value: RequestType_Market,
    },
    Trigger: {
        discriminator: 1,
        value: RequestType_Trigger,
    },
})

export interface CreateDecreasePositionRequest2Params {
    collateralUsdDelta: bigint
    sizeUsdDelta: bigint
    requestType: RequestType
    priceSlippage?: bigint | undefined
    jupiterMinimumOut?: bigint | undefined
    triggerPrice?: bigint | undefined
    triggerAboveThreshold?: boolean | undefined
    entirePosition?: boolean | undefined
    counter: bigint
}

export const CreateDecreasePositionRequest2Params: Codec<CreateDecreasePositionRequest2Params> = struct({
    collateralUsdDelta: u64,
    sizeUsdDelta: u64,
    requestType: RequestType,
    priceSlippage: option(u64),
    jupiterMinimumOut: option(u64),
    triggerPrice: option(u64),
    triggerAboveThreshold: option(bool),
    entirePosition: option(bool),
    counter: u64,
})

export type Side_None = undefined

export const Side_None = unit

export type Side_Long = undefined

export const Side_Long = unit

export type Side_Short = undefined

export const Side_Short = unit

export type Side = 
    | {
        kind: 'None'
        value?: Side_None
      }
    | {
        kind: 'Long'
        value?: Side_Long
      }
    | {
        kind: 'Short'
        value?: Side_Short
      }

export const Side: Codec<Side> = sum(1, {
    None: {
        discriminator: 0,
        value: Side_None,
    },
    Long: {
        discriminator: 1,
        value: Side_Long,
    },
    Short: {
        discriminator: 2,
        value: Side_Short,
    },
})

export interface CreateIncreasePositionMarketRequestParams {
    sizeUsdDelta: bigint
    collateralTokenDelta: bigint
    side: Side
    priceSlippage: bigint
    jupiterMinimumOut?: bigint | undefined
    counter: bigint
}

export const CreateIncreasePositionMarketRequestParams: Codec<CreateIncreasePositionMarketRequestParams> = struct({
    sizeUsdDelta: u64,
    collateralTokenDelta: u64,
    side: Side,
    priceSlippage: u64,
    jupiterMinimumOut: option(u64),
    counter: u64,
})

export interface CreateTokenMetadataParams {
    name: string
    symbol: string
    uri: string
}

export const CreateTokenMetadataParams: Codec<CreateTokenMetadataParams> = struct({
    name: string,
    symbol: string,
    uri: string,
})

export type DecreasePosition4Params = undefined

export const DecreasePosition4Params: Codec<DecreasePosition4Params> = unit

export type DecreasePositionWithInternalSwapParams = undefined

export const DecreasePositionWithInternalSwapParams: Codec<DecreasePositionWithInternalSwapParams> = unit

export type DecreasePositionWithTpslAndInternalSwapParams = undefined

export const DecreasePositionWithTpslAndInternalSwapParams: Codec<DecreasePositionWithTpslAndInternalSwapParams> = unit

export type DecreasePositionWithTpslParams = undefined

export const DecreasePositionWithTpslParams: Codec<DecreasePositionWithTpslParams> = unit

export interface DepositParams {
    amount: bigint
}

export const DepositParams: Codec<DepositParams> = struct({
    amount: u64,
})

export interface GetAddLiquidityAmountAndFee2Params {
    tokenAmountIn: bigint
}

export const GetAddLiquidityAmountAndFee2Params: Codec<GetAddLiquidityAmountAndFee2Params> = struct({
    tokenAmountIn: u64,
})

export type PriceCalcMode_Min = undefined

export const PriceCalcMode_Min = unit

export type PriceCalcMode_Max = undefined

export const PriceCalcMode_Max = unit

export type PriceCalcMode_Ignore = undefined

export const PriceCalcMode_Ignore = unit

export type PriceCalcMode = 
    | {
        kind: 'Min'
        value?: PriceCalcMode_Min
      }
    | {
        kind: 'Max'
        value?: PriceCalcMode_Max
      }
    | {
        kind: 'Ignore'
        value?: PriceCalcMode_Ignore
      }

export const PriceCalcMode: Codec<PriceCalcMode> = sum(1, {
    Min: {
        discriminator: 0,
        value: PriceCalcMode_Min,
    },
    Max: {
        discriminator: 1,
        value: PriceCalcMode_Max,
    },
    Ignore: {
        discriminator: 2,
        value: PriceCalcMode_Ignore,
    },
})

export interface GetAssetsUnderManagement2Params {
    mode?: PriceCalcMode | undefined
}

export const GetAssetsUnderManagement2Params: Codec<GetAssetsUnderManagement2Params> = struct({
    mode: option(PriceCalcMode),
})

export interface GetRemoveLiquidityAmountAndFee2Params {
    lpAmountIn: bigint
}

export const GetRemoveLiquidityAmountAndFee2Params: Codec<GetRemoveLiquidityAmountAndFee2Params> = struct({
    lpAmountIn: u64,
})

export type IncreasePosition4Params = undefined

export const IncreasePosition4Params: Codec<IncreasePosition4Params> = unit

export type IncreasePositionPreSwapParams = undefined

export const IncreasePositionPreSwapParams: Codec<IncreasePositionPreSwapParams> = unit

export type IncreasePositionWithInternalSwapParams = undefined

export const IncreasePositionWithInternalSwapParams: Codec<IncreasePositionWithInternalSwapParams> = unit

export interface InitParams {
    allowSwap: boolean
    allowAddLiquidity: boolean
    allowRemoveLiquidity: boolean
    allowIncreasePosition: boolean
    allowDecreasePosition: boolean
    allowCollateralWithdrawal: boolean
    allowLiquidatePosition: boolean
}

export const InitParams: Codec<InitParams> = struct({
    allowSwap: bool,
    allowAddLiquidity: bool,
    allowRemoveLiquidity: bool,
    allowIncreasePosition: bool,
    allowDecreasePosition: bool,
    allowCollateralWithdrawal: bool,
    allowLiquidatePosition: bool,
})

export interface InstantCreateLimitOrderParams {
    sizeUsdDelta: bigint
    collateralTokenDelta: bigint
    side: Side
    triggerPrice: bigint
    triggerAboveThreshold: boolean
    counter: bigint
    requestTime: bigint
}

export const InstantCreateLimitOrderParams: Codec<InstantCreateLimitOrderParams> = struct({
    sizeUsdDelta: u64,
    collateralTokenDelta: u64,
    side: Side,
    triggerPrice: u64,
    triggerAboveThreshold: bool,
    counter: u64,
    requestTime: i64,
})

export interface InstantCreateTpslParams {
    collateralUsdDelta: bigint
    sizeUsdDelta: bigint
    triggerPrice: bigint
    triggerAboveThreshold: boolean
    entirePosition: boolean
    counter: bigint
    requestTime: bigint
}

export const InstantCreateTpslParams: Codec<InstantCreateTpslParams> = struct({
    collateralUsdDelta: u64,
    sizeUsdDelta: u64,
    triggerPrice: u64,
    triggerAboveThreshold: bool,
    entirePosition: bool,
    counter: u64,
    requestTime: i64,
})

export interface InstantDecreasePosition2Params {
    collateralUsdDelta: bigint
    sizeUsdDelta: bigint
    priceSlippage: bigint
    entirePosition?: boolean | undefined
    requestTime: bigint
    counter: bigint
}

export const InstantDecreasePosition2Params: Codec<InstantDecreasePosition2Params> = struct({
    collateralUsdDelta: u64,
    sizeUsdDelta: u64,
    priceSlippage: u64,
    entirePosition: option(bool),
    requestTime: i64,
    counter: u64,
})

export interface InstantDecreasePositionParams {
    collateralUsdDelta: bigint
    sizeUsdDelta: bigint
    priceSlippage: bigint
    entirePosition?: boolean | undefined
    requestTime: bigint
}

export const InstantDecreasePositionParams: Codec<InstantDecreasePositionParams> = struct({
    collateralUsdDelta: u64,
    sizeUsdDelta: u64,
    priceSlippage: u64,
    entirePosition: option(bool),
    requestTime: i64,
})

export interface InstantIncreasePositionPreSwapParams {
    amountIn: bigint
    minAmountOut: bigint
}

export const InstantIncreasePositionPreSwapParams: Codec<InstantIncreasePositionPreSwapParams> = struct({
    amountIn: u64,
    minAmountOut: u64,
})

export interface InstantIncreasePositionParams {
    sizeUsdDelta: bigint
    collateralTokenDelta?: bigint | undefined
    side: Side
    priceSlippage: bigint
    requestTime: bigint
}

export const InstantIncreasePositionParams: Codec<InstantIncreasePositionParams> = struct({
    sizeUsdDelta: u64,
    collateralTokenDelta: option(u64),
    side: Side,
    priceSlippage: u64,
    requestTime: i64,
})

export interface InstantUpdateLimitOrderParams {
    sizeUsdDelta: bigint
    triggerPrice: bigint
    requestTime: bigint
}

export const InstantUpdateLimitOrderParams: Codec<InstantUpdateLimitOrderParams> = struct({
    sizeUsdDelta: u64,
    triggerPrice: u64,
    requestTime: i64,
})

export interface InstantUpdateTpslParams {
    sizeUsdDelta: bigint
    triggerPrice: bigint
    requestTime: bigint
}

export const InstantUpdateTpslParams: Codec<InstantUpdateTpslParams> = struct({
    sizeUsdDelta: u64,
    triggerPrice: u64,
    requestTime: i64,
})

export type LiquidateBorrowPositionParams = undefined

export const LiquidateBorrowPositionParams: Codec<LiquidateBorrowPositionParams> = unit

export type LiquidateFullPosition4Params = undefined

export const LiquidateFullPosition4Params: Codec<LiquidateFullPosition4Params> = unit

export interface BorrowLendParams {
    borrowsLimitInBps: bigint
    maintainanceMarginBps: bigint
    protocolFeeBps: bigint
    liquidationMargin: bigint
    liquidationFeeBps: bigint
}

export const BorrowLendParams: Codec<BorrowLendParams> = struct({
    borrowsLimitInBps: u64,
    maintainanceMarginBps: u64,
    protocolFeeBps: u64,
    liquidationMargin: u64,
    liquidationFeeBps: u64,
})

export interface OperatorSetCustodyConfigParams {
    pricing: PricingParams
    hourlyFundingDbps: bigint
    targetRatioBps: bigint
    increasePositionBps: bigint
    decreasePositionBps: bigint
    maxPositionSizeUsd: bigint
    jumpRate: JumpRateState
    priceImpactFeeFactor: bigint
    priceImpactExponent: number
    deltaImbalanceThresholdDecimal: bigint
    maxFeeBps: bigint
    borrowLendParameters: BorrowLendParams
    borrowHourlyFundingDbps: bigint
    borrowLimitInTokenAmount: bigint
    minInterestFeeBps: bigint
    minInterestFeeGracePeriodSeconds: bigint
    maxTotalStakedAmountLamports: bigint
    externalSwapFeeMultiplierBps: bigint
    disableClosePositionRequest: boolean
    withdrawalLimitTokenAmount: bigint
    withdrawalLimitIntervalSeconds: bigint
}

export const OperatorSetCustodyConfigParams: Codec<OperatorSetCustodyConfigParams> = struct({
    pricing: PricingParams,
    hourlyFundingDbps: u64,
    targetRatioBps: u64,
    increasePositionBps: u64,
    decreasePositionBps: u64,
    maxPositionSizeUsd: u64,
    jumpRate: JumpRateState,
    priceImpactFeeFactor: u64,
    priceImpactExponent: f32,
    deltaImbalanceThresholdDecimal: u64,
    maxFeeBps: u64,
    borrowLendParameters: BorrowLendParams,
    borrowHourlyFundingDbps: u64,
    borrowLimitInTokenAmount: u64,
    minInterestFeeBps: u64,
    minInterestFeeGracePeriodSeconds: u64,
    maxTotalStakedAmountLamports: u64,
    externalSwapFeeMultiplierBps: u64,
    disableClosePositionRequest: bool,
    withdrawalLimitTokenAmount: u64,
    withdrawalLimitIntervalSeconds: u64,
})

export interface OperatorSetPoolConfigParams {
    fees: Fees
    limit: Limit
    maxRequestExecutionSec: bigint
    maxTriggerPriceDiffBps: bigint
    disableClosePositionRequest: boolean
    maxLpTokenPriceChangeBps: bigint
}

export const OperatorSetPoolConfigParams: Codec<OperatorSetPoolConfigParams> = struct({
    fees: Fees,
    limit: Limit,
    maxRequestExecutionSec: i64,
    maxTriggerPriceDiffBps: u64,
    disableClosePositionRequest: bool,
    maxLpTokenPriceChangeBps: u64,
})

export type PartialLiquidateBorrowPositionParams = undefined

export const PartialLiquidateBorrowPositionParams: Codec<PartialLiquidateBorrowPositionParams> = unit

export type RefreshAssetsUnderManagementParams = undefined

export const RefreshAssetsUnderManagementParams: Codec<RefreshAssetsUnderManagementParams> = unit

export interface RemoveLiquidity2Params {
    lpAmountIn: bigint
    minAmountOut: bigint
}

export const RemoveLiquidity2Params: Codec<RemoveLiquidity2Params> = struct({
    lpAmountIn: u64,
    minAmountOut: u64,
})

export interface RepayToCustodyParams {
    amount: bigint
}

export const RepayToCustodyParams: Codec<RepayToCustodyParams> = struct({
    amount: u64,
})

export interface SetCustodyConfigParams {
    oracle: OracleParams
    pricing: PricingParams
    permissions: Permissions
    hourlyFundingDbps: bigint
    targetRatioBps: bigint
    increasePositionBps: bigint
    decreasePositionBps: bigint
    dovesOracle: string
    maxPositionSizeUsd: bigint
    jumpRate: JumpRateState
    priceImpactFeeFactor: bigint
    priceImpactExponent: number
    deltaImbalanceThresholdDecimal: bigint
    maxFeeBps: bigint
    dovesAgOracle: string
    borrowLendParameters: BorrowLendParams
    borrowHourlyFundingDbps: bigint
    borrowLimitInTokenAmount: bigint
    minInterestFeeBps: bigint
    minInterestFeeGracePeriodSeconds: bigint
    maxTotalStakedAmountLamports: bigint
    externalSwapFeeMultiplierBps: bigint
    disableClosePositionRequest: boolean
    withdrawalLimitIntervalSeconds: bigint
    withdrawalLimitTokenAmount: bigint
}

export const SetCustodyConfigParams: Codec<SetCustodyConfigParams> = struct({
    oracle: OracleParams,
    pricing: PricingParams,
    permissions: Permissions,
    hourlyFundingDbps: u64,
    targetRatioBps: u64,
    increasePositionBps: u64,
    decreasePositionBps: u64,
    dovesOracle: address,
    maxPositionSizeUsd: u64,
    jumpRate: JumpRateState,
    priceImpactFeeFactor: u64,
    priceImpactExponent: f32,
    deltaImbalanceThresholdDecimal: u64,
    maxFeeBps: u64,
    dovesAgOracle: address,
    borrowLendParameters: BorrowLendParams,
    borrowHourlyFundingDbps: u64,
    borrowLimitInTokenAmount: u64,
    minInterestFeeBps: u64,
    minInterestFeeGracePeriodSeconds: u64,
    maxTotalStakedAmountLamports: u64,
    externalSwapFeeMultiplierBps: u64,
    disableClosePositionRequest: bool,
    withdrawalLimitIntervalSeconds: u64,
    withdrawalLimitTokenAmount: u64,
})

export interface SetMaxGlobalSizesParams {
    maxGlobalLongSize: bigint
    maxGlobalShortSize: bigint
    recoveryId: number
    signature: Array<number>
    referenceId: Array<number>
    timestamp: bigint
}

export const SetMaxGlobalSizesParams: Codec<SetMaxGlobalSizesParams> = struct({
    maxGlobalLongSize: u64,
    maxGlobalShortSize: u64,
    recoveryId: u8,
    signature: fixedArray(u8, 64),
    referenceId: fixedArray(u8, 16),
    timestamp: u64,
})

export interface SetPerpetualsConfigParams {
    permissions: Permissions
}

export const SetPerpetualsConfigParams: Codec<SetPerpetualsConfigParams> = struct({
    permissions: Permissions,
})

export interface Secp256K1Pubkey {
    prefix: number
    key: Array<number>
}

export const Secp256K1Pubkey: Codec<Secp256K1Pubkey> = struct({
    prefix: u8,
    key: fixedArray(u8, 32),
})

export interface SetPoolConfigParams {
    fees: Fees
    limit: Limit
    maxRequestExecutionSec: bigint
    parameterUpdateOracle: Secp256K1Pubkey
    maxTriggerPriceDiffBps: bigint
    disableClosePositionRequest: boolean
    maxLpTokenPriceChangeBps: bigint
}

export const SetPoolConfigParams: Codec<SetPoolConfigParams> = struct({
    fees: Fees,
    limit: Limit,
    maxRequestExecutionSec: i64,
    parameterUpdateOracle: Secp256K1Pubkey,
    maxTriggerPriceDiffBps: u64,
    disableClosePositionRequest: bool,
    maxLpTokenPriceChangeBps: u64,
})

export interface SetTestTimeParams {
    time: bigint
}

export const SetTestTimeParams: Codec<SetTestTimeParams> = struct({
    time: i64,
})

export interface Swap2Params {
    amountIn: bigint
    minAmountOut: bigint
}

export const Swap2Params: Codec<Swap2Params> = struct({
    amountIn: u64,
    minAmountOut: u64,
})

export interface SwapWithTokenLedgerParams {
    minAmountOut: bigint
}

export const SwapWithTokenLedgerParams: Codec<SwapWithTokenLedgerParams> = struct({
    minAmountOut: u64,
})

export interface TestInitParams {
    allowSwap: boolean
    allowAddLiquidity: boolean
    allowRemoveLiquidity: boolean
    allowIncreasePosition: boolean
    allowDecreasePosition: boolean
    allowCollateralWithdrawal: boolean
    allowLiquidatePosition: boolean
}

export const TestInitParams: Codec<TestInitParams> = struct({
    allowSwap: bool,
    allowAddLiquidity: bool,
    allowRemoveLiquidity: bool,
    allowIncreasePosition: bool,
    allowDecreasePosition: bool,
    allowCollateralWithdrawal: bool,
    allowLiquidatePosition: bool,
})

export type TransferAdminParams = undefined

export const TransferAdminParams: Codec<TransferAdminParams> = unit

export interface UpdateDecreasePositionRequest2Params {
    sizeUsdDelta: bigint
    triggerPrice: bigint
}

export const UpdateDecreasePositionRequest2Params: Codec<UpdateDecreasePositionRequest2Params> = struct({
    sizeUsdDelta: u64,
    triggerPrice: u64,
})

export interface WithdrawParams {
    amount: bigint
}

export const WithdrawParams: Codec<WithdrawParams> = struct({
    amount: u64,
})

export type WithdrawFees2Params = undefined

export const WithdrawFees2Params: Codec<WithdrawFees2Params> = unit

export interface PriceImpactBuffer {
    openInterest: Array<bigint>
    lastUpdated: bigint
    feeFactor: bigint
    exponent: number
    deltaImbalanceThresholdDecimal: bigint
    maxFeeBps: bigint
}

export const PriceImpactBuffer: Codec<PriceImpactBuffer> = struct({
    openInterest: fixedArray(i64, 60),
    lastUpdated: i64,
    feeFactor: u64,
    exponent: f32,
    deltaImbalanceThresholdDecimal: u64,
    maxFeeBps: u64,
})

export interface Assets {
    feesReserves: bigint
    owned: bigint
    locked: bigint
    guaranteedUsd: bigint
    globalShortSizes: bigint
    globalShortAveragePrices: bigint
}

export const Assets: Codec<Assets> = struct({
    feesReserves: u64,
    owned: u64,
    locked: u64,
    guaranteedUsd: u64,
    globalShortSizes: u64,
    globalShortAveragePrices: u64,
})

export interface FundingRateState {
    cumulativeInterestRate: bigint
    lastUpdate: bigint
    hourlyFundingDbps: bigint
}

export const FundingRateState: Codec<FundingRateState> = struct({
    cumulativeInterestRate: u128,
    lastUpdate: i64,
    hourlyFundingDbps: u64,
})

export interface OraclePrice {
    price: bigint
    exponent: number
}

export const OraclePrice: Codec<OraclePrice> = struct({
    price: u64,
    exponent: i32,
})

export interface Price {
    price: bigint
    expo: number
    publishTime: bigint
}

export const Price: Codec<Price> = struct({
    price: u64,
    expo: i32,
    publishTime: i64,
})

export interface AmountAndFee {
    amount: bigint
    fee: bigint
    feeBps: bigint
}

export const AmountAndFee: Codec<AmountAndFee> = struct({
    amount: u64,
    fee: u64,
    feeBps: u64,
})

export interface PoolApr {
    lastUpdated: bigint
    feeAprBps: bigint
    realizedFeeUsd: bigint
}

export const PoolApr: Codec<PoolApr> = struct({
    lastUpdated: i64,
    feeAprBps: u64,
    realizedFeeUsd: u64,
})

export type PriceImpactMechanism_TradeSize = undefined

export const PriceImpactMechanism_TradeSize = unit

export type PriceImpactMechanism_DeltaImbalance = undefined

export const PriceImpactMechanism_DeltaImbalance = unit

export type PriceImpactMechanism = 
    | {
        kind: 'TradeSize'
        value?: PriceImpactMechanism_TradeSize
      }
    | {
        kind: 'DeltaImbalance'
        value?: PriceImpactMechanism_DeltaImbalance
      }

export const PriceImpactMechanism: Codec<PriceImpactMechanism> = sum(1, {
    TradeSize: {
        discriminator: 0,
        value: PriceImpactMechanism_TradeSize,
    },
    DeltaImbalance: {
        discriminator: 1,
        value: PriceImpactMechanism_DeltaImbalance,
    },
})

export type PriceStaleTolerance_Strict = undefined

export const PriceStaleTolerance_Strict = unit

export type PriceStaleTolerance_Loose = undefined

export const PriceStaleTolerance_Loose = unit

export type PriceStaleTolerance = 
    | {
        kind: 'Strict'
        value?: PriceStaleTolerance_Strict
      }
    | {
        kind: 'Loose'
        value?: PriceStaleTolerance_Loose
      }

export const PriceStaleTolerance: Codec<PriceStaleTolerance> = sum(1, {
    Strict: {
        discriminator: 0,
        value: PriceStaleTolerance_Strict,
    },
    Loose: {
        discriminator: 1,
        value: PriceStaleTolerance_Loose,
    },
})

export type TradePoolType_Increase = undefined

export const TradePoolType_Increase = unit

export type TradePoolType_Decrease = undefined

export const TradePoolType_Decrease = unit

export type TradePoolType = 
    | {
        kind: 'Increase'
        value?: TradePoolType_Increase
      }
    | {
        kind: 'Decrease'
        value?: TradePoolType_Decrease
      }

export const TradePoolType: Codec<TradePoolType> = sum(1, {
    Increase: {
        discriminator: 0,
        value: TradePoolType_Increase,
    },
    Decrease: {
        discriminator: 1,
        value: TradePoolType_Decrease,
    },
})

export type RequestChange_None = undefined

export const RequestChange_None = unit

export type RequestChange_Increase = undefined

export const RequestChange_Increase = unit

export type RequestChange_Decrease = undefined

export const RequestChange_Decrease = unit

export type RequestChange = 
    | {
        kind: 'None'
        value?: RequestChange_None
      }
    | {
        kind: 'Increase'
        value?: RequestChange_Increase
      }
    | {
        kind: 'Decrease'
        value?: RequestChange_Decrease
      }

export const RequestChange: Codec<RequestChange> = sum(1, {
    None: {
        discriminator: 0,
        value: RequestChange_None,
    },
    Increase: {
        discriminator: 1,
        value: RequestChange_Increase,
    },
    Decrease: {
        discriminator: 2,
        value: RequestChange_Decrease,
    },
})

export interface BorrowPosition {
    owner: string
    pool: string
    custody: string
    openTime: bigint
    updateTime: bigint
    borrowSize: bigint
    cumulativeCompoundedInterestSnapshot: bigint
    lockedCollateral: bigint
    bump: number
    lastBorrowed: bigint
}

export const BorrowPosition: Codec<BorrowPosition> = struct({
    owner: address,
    pool: address,
    custody: address,
    openTime: i64,
    updateTime: i64,
    borrowSize: u128,
    cumulativeCompoundedInterestSnapshot: u128,
    lockedCollateral: u64,
    bump: u8,
    lastBorrowed: i64,
})

export interface Custody {
    pool: string
    mint: string
    tokenAccount: string
    decimals: number
    isStable: boolean
    oracle: OracleParams
    pricing: PricingParams
    permissions: Permissions
    targetRatioBps: bigint
    assets: Assets
    fundingRateState: FundingRateState
    bump: number
    tokenAccountBump: number
    increasePositionBps: bigint
    decreasePositionBps: bigint
    maxPositionSizeUsd: bigint
    dovesOracle: string
    jumpRateState: JumpRateState
    dovesAgOracle: string
    priceImpactBuffer: PriceImpactBuffer
    borrowLendParameters: BorrowLendParams
    borrowsFundingRateState: FundingRateState
    debt: bigint
    borrowLendInterestsAccured: bigint
    borrowLimitInTokenAmount: bigint
    minInterestFeeBps: bigint
    minInterestFeeGracePeriodSeconds: bigint
    totalStakedAmountLamports: bigint
    maxTotalStakedAmountLamports: bigint
    externalSwapFeeMultiplierBps: bigint
    disableClosePositionRequest: boolean
    withdrawalLimitTokenAmount: bigint
    withdrawalTokenAmountAccumulated: bigint
    withdrawalLimitLastResetAt: bigint
    withdrawalLimitIntervalSeconds: bigint
}

export const Custody: Codec<Custody> = struct({
    pool: address,
    mint: address,
    tokenAccount: address,
    decimals: u8,
    isStable: bool,
    oracle: OracleParams,
    pricing: PricingParams,
    permissions: Permissions,
    targetRatioBps: u64,
    assets: Assets,
    fundingRateState: FundingRateState,
    bump: u8,
    tokenAccountBump: u8,
    increasePositionBps: u64,
    decreasePositionBps: u64,
    maxPositionSizeUsd: u64,
    dovesOracle: address,
    jumpRateState: JumpRateState,
    dovesAgOracle: address,
    priceImpactBuffer: PriceImpactBuffer,
    borrowLendParameters: BorrowLendParams,
    borrowsFundingRateState: FundingRateState,
    debt: u128,
    borrowLendInterestsAccured: u128,
    borrowLimitInTokenAmount: u64,
    minInterestFeeBps: u64,
    minInterestFeeGracePeriodSeconds: u64,
    totalStakedAmountLamports: u64,
    maxTotalStakedAmountLamports: u64,
    externalSwapFeeMultiplierBps: u64,
    disableClosePositionRequest: bool,
    withdrawalLimitTokenAmount: u64,
    withdrawalTokenAmountAccumulated: u64,
    withdrawalLimitLastResetAt: i64,
    withdrawalLimitIntervalSeconds: u64,
})

export interface Perpetuals {
    permissions: Permissions
    pools: Array<string>
    admin: string
    transferAuthorityBump: number
    perpetualsBump: number
    inceptionTime: bigint
}

export const Perpetuals: Codec<Perpetuals> = struct({
    permissions: Permissions,
    pools: array(address),
    admin: address,
    transferAuthorityBump: u8,
    perpetualsBump: u8,
    inceptionTime: i64,
})

export interface Pool {
    name: string
    custodies: Array<string>
    aumUsd: bigint
    limit: Limit
    fees: Fees
    poolApr: PoolApr
    maxRequestExecutionSec: bigint
    bump: number
    lpTokenBump: number
    inceptionTime: bigint
    parameterUpdateOracle: Secp256K1Pubkey
    aumUsdUpdatedAt: bigint
    maxTriggerPriceDiffBps: bigint
    disableClosePositionRequest: boolean
    maxLpTokenPriceChangeBps: bigint
    aumUsdRefreshedAtSlot: bigint
}

export const Pool: Codec<Pool> = struct({
    name: string,
    custodies: array(address),
    aumUsd: u128,
    limit: Limit,
    fees: Fees,
    poolApr: PoolApr,
    maxRequestExecutionSec: i64,
    bump: u8,
    lpTokenBump: u8,
    inceptionTime: i64,
    parameterUpdateOracle: Secp256K1Pubkey,
    aumUsdUpdatedAt: i64,
    maxTriggerPriceDiffBps: u64,
    disableClosePositionRequest: bool,
    maxLpTokenPriceChangeBps: u64,
    aumUsdRefreshedAtSlot: u64,
})

export interface PositionRequest {
    owner: string
    pool: string
    custody: string
    position: string
    mint: string
    openTime: bigint
    updateTime: bigint
    sizeUsdDelta: bigint
    collateralDelta: bigint
    requestChange: RequestChange
    requestType: RequestType
    side: Side
    priceSlippage?: bigint | undefined
    jupiterMinimumOut?: bigint | undefined
    preSwapAmount?: bigint | undefined
    triggerPrice?: bigint | undefined
    triggerAboveThreshold?: boolean | undefined
    entirePosition?: boolean | undefined
    executed: boolean
    counter: bigint
    bump: number
    referral?: string | undefined
}

export const PositionRequest: Codec<PositionRequest> = struct({
    owner: address,
    pool: address,
    custody: address,
    position: address,
    mint: address,
    openTime: i64,
    updateTime: i64,
    sizeUsdDelta: u64,
    collateralDelta: u64,
    requestChange: RequestChange,
    requestType: RequestType,
    side: Side,
    priceSlippage: option(u64),
    jupiterMinimumOut: option(u64),
    preSwapAmount: option(u64),
    triggerPrice: option(u64),
    triggerAboveThreshold: option(bool),
    entirePosition: option(bool),
    executed: bool,
    counter: u64,
    bump: u8,
    referral: option(address),
})

export interface Position {
    owner: string
    pool: string
    custody: string
    collateralCustody: string
    openTime: bigint
    updateTime: bigint
    side: Side
    price: bigint
    sizeUsd: bigint
    collateralUsd: bigint
    realisedPnlUsd: bigint
    cumulativeInterestSnapshot: bigint
    lockedAmount: bigint
    bump: number
}

export const Position: Codec<Position> = struct({
    owner: address,
    pool: address,
    custody: address,
    collateralCustody: address,
    openTime: i64,
    updateTime: i64,
    side: Side,
    price: u64,
    sizeUsd: u64,
    collateralUsd: u64,
    realisedPnlUsd: i64,
    cumulativeInterestSnapshot: u128,
    lockedAmount: u64,
    bump: u8,
})

export interface StakeInfo {
    pool: string
    stakeAccount: string
    currentStakedAmountLamports: bigint
    totalStakingRewardsLamports: bigint
    lastUpdatedAt: bigint
    deactivating: boolean
    stakeAccountIndex: bigint
    bump: number
}

export const StakeInfo: Codec<StakeInfo> = struct({
    pool: address,
    stakeAccount: address,
    currentStakedAmountLamports: u64,
    totalStakingRewardsLamports: u64,
    lastUpdatedAt: i64,
    deactivating: bool,
    stakeAccountIndex: u64,
    bump: u8,
})

export interface TokenLedger {
    tokenAccount: string
    amount: bigint
}

export const TokenLedger: Codec<TokenLedger> = struct({
    tokenAccount: address,
    amount: u64,
})

export interface CreatePositionRequestEvent {
    owner: string
    pool: string
    positionKey: string
    positionSide: number
    positionMint: string
    positionCustody: string
    positionCollateralMint: string
    positionCollateralCustody: string
    positionRequestKey: string
    positionRequestMint: string
    sizeUsdDelta: bigint
    collateralDelta: bigint
    priceSlippage?: bigint | undefined
    jupiterMinimumOut?: bigint | undefined
    preSwapAmount?: bigint | undefined
    requestChange: number
    openTime: bigint
    referral?: string | undefined
}

export const CreatePositionRequestEvent: Codec<CreatePositionRequestEvent> = struct({
    owner: address,
    pool: address,
    positionKey: address,
    positionSide: u8,
    positionMint: address,
    positionCustody: address,
    positionCollateralMint: address,
    positionCollateralCustody: address,
    positionRequestKey: address,
    positionRequestMint: address,
    sizeUsdDelta: u64,
    collateralDelta: u64,
    priceSlippage: option(u64),
    jupiterMinimumOut: option(u64),
    preSwapAmount: option(u64),
    requestChange: u8,
    openTime: i64,
    referral: option(address),
})

export interface InstantCreateTpslEvent {
    owner: string
    pool: string
    positionKey: string
    positionSide: number
    positionMint: string
    positionCustody: string
    positionCollateralCustody: string
    positionRequestKey: string
    positionRequestMint: string
    sizeUsdDelta: bigint
    collateralDelta: bigint
    entirePosition: boolean
    openTime: bigint
}

export const InstantCreateTpslEvent: Codec<InstantCreateTpslEvent> = struct({
    owner: address,
    pool: address,
    positionKey: address,
    positionSide: u8,
    positionMint: address,
    positionCustody: address,
    positionCollateralCustody: address,
    positionRequestKey: address,
    positionRequestMint: address,
    sizeUsdDelta: u64,
    collateralDelta: u64,
    entirePosition: bool,
    openTime: i64,
})

export interface InstantUpdateTpslEvent {
    owner: string
    pool: string
    positionKey: string
    positionSide: number
    positionMint: string
    positionCustody: string
    positionCollateralCustody: string
    positionRequestKey: string
    positionRequestMint: string
    sizeUsdDelta: bigint
    collateralDelta: bigint
    entirePosition: boolean
    updateTime: bigint
}

export const InstantUpdateTpslEvent: Codec<InstantUpdateTpslEvent> = struct({
    owner: address,
    pool: address,
    positionKey: address,
    positionSide: u8,
    positionMint: address,
    positionCustody: address,
    positionCollateralCustody: address,
    positionRequestKey: address,
    positionRequestMint: address,
    sizeUsdDelta: u64,
    collateralDelta: u64,
    entirePosition: bool,
    updateTime: i64,
})

export interface ClosePositionRequestEvent {
    entirePosition?: boolean | undefined
    executed: boolean
    requestChange: number
    requestType: number
    side: number
    positionRequestKey: string
    owner: string
    mint: string
    amount: bigint
    openTime: bigint
}

export const ClosePositionRequestEvent: Codec<ClosePositionRequestEvent> = struct({
    entirePosition: option(bool),
    executed: bool,
    requestChange: u8,
    requestType: u8,
    side: u8,
    positionRequestKey: address,
    owner: address,
    mint: address,
    amount: u64,
    openTime: i64,
})

export interface IncreasePositionEvent {
    positionKey: string
    positionSide: number
    positionCustody: string
    positionCollateralCustody: string
    positionSizeUsd: bigint
    positionMint: string
    positionRequestKey: string
    positionRequestMint: string
    positionRequestChange: number
    positionRequestType: number
    positionRequestCollateralDelta: bigint
    owner: string
    pool: string
    sizeUsdDelta: bigint
    collateralUsdDelta: bigint
    collateralTokenDelta: bigint
    price: bigint
    priceSlippage?: bigint | undefined
    feeToken: bigint
    feeUsd: bigint
    openTime: bigint
    referral?: string | undefined
    positionFeeUsd: bigint
    fundingFeeUsd: bigint
    priceImpactFeeUsd: bigint
}

export const IncreasePositionEvent: Codec<IncreasePositionEvent> = struct({
    positionKey: address,
    positionSide: u8,
    positionCustody: address,
    positionCollateralCustody: address,
    positionSizeUsd: u64,
    positionMint: address,
    positionRequestKey: address,
    positionRequestMint: address,
    positionRequestChange: u8,
    positionRequestType: u8,
    positionRequestCollateralDelta: u64,
    owner: address,
    pool: address,
    sizeUsdDelta: u64,
    collateralUsdDelta: u64,
    collateralTokenDelta: u64,
    price: u64,
    priceSlippage: option(u64),
    feeToken: u64,
    feeUsd: u64,
    openTime: i64,
    referral: option(address),
    positionFeeUsd: u64,
    fundingFeeUsd: u64,
    priceImpactFeeUsd: u64,
})

export interface IncreasePositionPreSwapEvent {
    positionRequestKey: string
    transferAmount: bigint
    collateralCustodyPreSwapAmount: bigint
}

export const IncreasePositionPreSwapEvent: Codec<IncreasePositionPreSwapEvent> = struct({
    positionRequestKey: address,
    transferAmount: u64,
    collateralCustodyPreSwapAmount: u64,
})

export interface DecreasePositionEvent {
    positionKey: string
    positionSide: number
    positionCustody: string
    positionCollateralCustody: string
    positionSizeUsd: bigint
    positionMint: string
    positionRequestKey: string
    positionRequestMint: string
    positionRequestChange: number
    positionRequestType: number
    hasProfit: boolean
    pnlDelta: bigint
    owner: string
    pool: string
    sizeUsdDelta: bigint
    transferAmountUsd: bigint
    transferToken?: bigint | undefined
    price: bigint
    priceSlippage?: bigint | undefined
    feeUsd: bigint
    openTime: bigint
    referral?: string | undefined
    positionFeeUsd: bigint
    fundingFeeUsd: bigint
    priceImpactFeeUsd: bigint
    originalPositionCollateralUsd: bigint
    positionCollateralUsd: bigint
    positionOpenTime: bigint
    positionPrice: bigint
}

export const DecreasePositionEvent: Codec<DecreasePositionEvent> = struct({
    positionKey: address,
    positionSide: u8,
    positionCustody: address,
    positionCollateralCustody: address,
    positionSizeUsd: u64,
    positionMint: address,
    positionRequestKey: address,
    positionRequestMint: address,
    positionRequestChange: u8,
    positionRequestType: u8,
    hasProfit: bool,
    pnlDelta: u64,
    owner: address,
    pool: address,
    sizeUsdDelta: u64,
    transferAmountUsd: u64,
    transferToken: option(u64),
    price: u64,
    priceSlippage: option(u64),
    feeUsd: u64,
    openTime: i64,
    referral: option(address),
    positionFeeUsd: u64,
    fundingFeeUsd: u64,
    priceImpactFeeUsd: u64,
    originalPositionCollateralUsd: u64,
    positionCollateralUsd: u64,
    positionOpenTime: i64,
    positionPrice: u64,
})

export interface DecreasePositionPostSwapEvent {
    positionRequestKey: string
    swapAmount: bigint
    jupiterMinimumOut?: bigint | undefined
}

export const DecreasePositionPostSwapEvent: Codec<DecreasePositionPostSwapEvent> = struct({
    positionRequestKey: address,
    swapAmount: u64,
    jupiterMinimumOut: option(u64),
})

export interface LiquidateFullPositionEvent {
    positionKey: string
    positionSide: number
    positionCustody: string
    positionCollateralCustody: string
    positionCollateralMint: string
    positionMint: string
    positionSizeUsd: bigint
    hasProfit: boolean
    pnlDelta: bigint
    owner: string
    pool: string
    transferAmountUsd: bigint
    transferToken: bigint
    price: bigint
    feeUsd: bigint
    liquidationFeeUsd: bigint
    openTime: bigint
    positionFeeUsd: bigint
    fundingFeeUsd: bigint
    priceImpactFeeUsd: bigint
    originalPositionCollateralUsd: bigint
    positionCollateralUsd: bigint
    positionOpenTime: bigint
    positionPrice: bigint
}

export const LiquidateFullPositionEvent: Codec<LiquidateFullPositionEvent> = struct({
    positionKey: address,
    positionSide: u8,
    positionCustody: address,
    positionCollateralCustody: address,
    positionCollateralMint: address,
    positionMint: address,
    positionSizeUsd: u64,
    hasProfit: bool,
    pnlDelta: u64,
    owner: address,
    pool: address,
    transferAmountUsd: u64,
    transferToken: u64,
    price: u64,
    feeUsd: u64,
    liquidationFeeUsd: u64,
    openTime: i64,
    positionFeeUsd: u64,
    fundingFeeUsd: u64,
    priceImpactFeeUsd: u64,
    originalPositionCollateralUsd: u64,
    positionCollateralUsd: u64,
    positionOpenTime: i64,
    positionPrice: u64,
})

export interface PoolSwapEvent {
    receivingCustodyKey: string
    dispensingCustodyKey: string
    poolKey: string
    amountIn: bigint
    amountOut: bigint
    swapUsdAmount: bigint
    amountOutAfterFees: bigint
    feeBps: bigint
    ownerKey: string
    receivingAccountKey: string
}

export const PoolSwapEvent: Codec<PoolSwapEvent> = struct({
    receivingCustodyKey: address,
    dispensingCustodyKey: address,
    poolKey: address,
    amountIn: u64,
    amountOut: u64,
    swapUsdAmount: u64,
    amountOutAfterFees: u64,
    feeBps: u64,
    ownerKey: address,
    receivingAccountKey: address,
})

export interface PoolSwapExactOutEvent {
    receivingCustodyKey: string
    dispensingCustodyKey: string
    poolKey: string
    amountIn: bigint
    amountInAfterFees: bigint
    amountOut: bigint
    swapUsdAmount: bigint
    feeBps: bigint
    ownerKey: string
    receivingAccountKey: string
}

export const PoolSwapExactOutEvent: Codec<PoolSwapExactOutEvent> = struct({
    receivingCustodyKey: address,
    dispensingCustodyKey: address,
    poolKey: address,
    amountIn: u64,
    amountInAfterFees: u64,
    amountOut: u64,
    swapUsdAmount: u64,
    feeBps: u64,
    ownerKey: address,
    receivingAccountKey: address,
})

export interface AddLiquidityEvent {
    custodyKey: string
    poolKey: string
    tokenAmountIn: bigint
    prePoolAmountUsd: bigint
    tokenAmountUsd: bigint
    feeBps: bigint
    tokenAmountAfterFee: bigint
    mintAmountUsd: bigint
    lpAmount: bigint
    postPoolAmountUsd: bigint
}

export const AddLiquidityEvent: Codec<AddLiquidityEvent> = struct({
    custodyKey: address,
    poolKey: address,
    tokenAmountIn: u64,
    prePoolAmountUsd: u128,
    tokenAmountUsd: u64,
    feeBps: u64,
    tokenAmountAfterFee: u64,
    mintAmountUsd: u64,
    lpAmount: u64,
    postPoolAmountUsd: u128,
})

export interface RemoveLiquidityEvent {
    custodyKey: string
    poolKey: string
    lpAmountIn: bigint
    removeAmountUsd: bigint
    feeBps: bigint
    removeTokenAmount: bigint
    tokenAmountAfterFee: bigint
    postPoolAmountUsd: bigint
}

export const RemoveLiquidityEvent: Codec<RemoveLiquidityEvent> = struct({
    custodyKey: address,
    poolKey: address,
    lpAmountIn: u64,
    removeAmountUsd: u64,
    feeBps: u64,
    removeTokenAmount: u64,
    tokenAmountAfterFee: u64,
    postPoolAmountUsd: u128,
})

export interface InstantCreateLimitOrderEvent {
    owner: string
    pool: string
    positionKey: string
    positionSide: number
    positionMint: string
    positionCustody: string
    positionCollateralMint: string
    positionCollateralCustody: string
    positionRequestKey: string
    positionRequestMint: string
    sizeUsdDelta: bigint
    collateralDelta: bigint
    openTime: bigint
}

export const InstantCreateLimitOrderEvent: Codec<InstantCreateLimitOrderEvent> = struct({
    owner: address,
    pool: address,
    positionKey: address,
    positionSide: u8,
    positionMint: address,
    positionCustody: address,
    positionCollateralMint: address,
    positionCollateralCustody: address,
    positionRequestKey: address,
    positionRequestMint: address,
    sizeUsdDelta: u64,
    collateralDelta: u64,
    openTime: i64,
})

export interface InstantIncreasePositionEvent {
    positionKey: string
    positionSide: number
    positionCustody: string
    positionCollateralCustody: string
    positionSizeUsd: bigint
    positionMint: string
    owner: string
    pool: string
    sizeUsdDelta: bigint
    collateralUsdDelta: bigint
    collateralTokenDelta: bigint
    price: bigint
    priceSlippage: bigint
    feeToken: bigint
    feeUsd: bigint
    openTime: bigint
    referral?: string | undefined
    positionFeeUsd: bigint
    fundingFeeUsd: bigint
    priceImpactFeeUsd: bigint
}

export const InstantIncreasePositionEvent: Codec<InstantIncreasePositionEvent> = struct({
    positionKey: address,
    positionSide: u8,
    positionCustody: address,
    positionCollateralCustody: address,
    positionSizeUsd: u64,
    positionMint: address,
    owner: address,
    pool: address,
    sizeUsdDelta: u64,
    collateralUsdDelta: u64,
    collateralTokenDelta: u64,
    price: u64,
    priceSlippage: u64,
    feeToken: u64,
    feeUsd: u64,
    openTime: i64,
    referral: option(address),
    positionFeeUsd: u64,
    fundingFeeUsd: u64,
    priceImpactFeeUsd: u64,
})

export interface InstantDecreasePositionEvent {
    positionKey: string
    positionSide: number
    positionCustody: string
    positionCollateralCustody: string
    positionSizeUsd: bigint
    positionMint: string
    desiredMint: string
    hasProfit: boolean
    pnlDelta: bigint
    owner: string
    pool: string
    sizeUsdDelta: bigint
    transferAmountUsd: bigint
    transferToken: bigint
    price: bigint
    priceSlippage: bigint
    feeUsd: bigint
    openTime: bigint
    referral?: string | undefined
    positionFeeUsd: bigint
    fundingFeeUsd: bigint
    originalPositionCollateralUsd: bigint
    positionCollateralUsd: bigint
    priceImpactFeeUsd: bigint
    positionOpenTime: bigint
    positionPrice: bigint
    positionRequest?: string | undefined
}

export const InstantDecreasePositionEvent: Codec<InstantDecreasePositionEvent> = struct({
    positionKey: address,
    positionSide: u8,
    positionCustody: address,
    positionCollateralCustody: address,
    positionSizeUsd: u64,
    positionMint: address,
    desiredMint: address,
    hasProfit: bool,
    pnlDelta: u64,
    owner: address,
    pool: address,
    sizeUsdDelta: u64,
    transferAmountUsd: u64,
    transferToken: u64,
    price: u64,
    priceSlippage: u64,
    feeUsd: u64,
    openTime: i64,
    referral: option(address),
    positionFeeUsd: u64,
    fundingFeeUsd: u64,
    originalPositionCollateralUsd: u64,
    positionCollateralUsd: u64,
    priceImpactFeeUsd: u64,
    positionOpenTime: i64,
    positionPrice: u64,
    positionRequest: option(address),
})

export interface DepositCollateralEvent {
    owner: string
    pool: string
    positionKey: string
    positionMint: string
    positionCustody: string
    depositAmount: bigint
    userTokenAccount: string
    time: bigint
}

export const DepositCollateralEvent: Codec<DepositCollateralEvent> = struct({
    owner: address,
    pool: address,
    positionKey: address,
    positionMint: address,
    positionCustody: address,
    depositAmount: u64,
    userTokenAccount: address,
    time: i64,
})

export interface WithdrawCollateralEvent {
    owner: string
    pool: string
    positionKey: string
    positionMint: string
    positionCustody: string
    withdrawAmount: bigint
    userTokenAccount: string
    custody: string
    previousCollateralAmount: bigint
    collateralAmount: bigint
    collateralAmountUsd: bigint
    marginUsd: bigint
    time: bigint
}

export const WithdrawCollateralEvent: Codec<WithdrawCollateralEvent> = struct({
    owner: address,
    pool: address,
    positionKey: address,
    positionMint: address,
    positionCustody: address,
    withdrawAmount: u64,
    userTokenAccount: address,
    custody: address,
    previousCollateralAmount: u64,
    collateralAmount: u64,
    collateralAmountUsd: u64,
    marginUsd: u64,
    time: i64,
})

export interface BorrowFromCustodyEvent {
    owner: string
    pool: string
    positionKey: string
    positionMint: string
    positionCustody: string
    sizeCustodyToken: bigint
    collateralAmount: bigint
    collateralAmountUsd: bigint
    marginUsd: bigint
    updateTime: bigint
}

export const BorrowFromCustodyEvent: Codec<BorrowFromCustodyEvent> = struct({
    owner: address,
    pool: address,
    positionKey: address,
    positionMint: address,
    positionCustody: address,
    sizeCustodyToken: u64,
    collateralAmount: u64,
    collateralAmountUsd: u64,
    marginUsd: u64,
    updateTime: i64,
})

export interface RepayToCustodyEvent {
    owner: string
    pool: string
    positionKey: string
    positionMint: string
    positionCustody: string
    sizeCustodyToken: bigint
    updateTime: bigint
    interest: bigint
}

export const RepayToCustodyEvent: Codec<RepayToCustodyEvent> = struct({
    owner: address,
    pool: address,
    positionKey: address,
    positionMint: address,
    positionCustody: address,
    sizeCustodyToken: u64,
    updateTime: i64,
    interest: u128,
})

export interface LiquidateBorrowPositionEvent {
    positionKey: string
    positionCustody: string
    positionSizeUsd: bigint
    owner: string
    pool: string
    collateralLockedInUsd: bigint
    collateralLockedInLp: bigint
    remainingCollateralInLp: bigint
    custodyTokenPrice: bigint
    totalBorrowsInUsd: bigint
    liquidationFeeUsd: bigint
    liquidationTime: bigint
}

export const LiquidateBorrowPositionEvent: Codec<LiquidateBorrowPositionEvent> = struct({
    positionKey: address,
    positionCustody: address,
    positionSizeUsd: u64,
    owner: address,
    pool: address,
    collateralLockedInUsd: u64,
    collateralLockedInLp: u64,
    remainingCollateralInLp: u64,
    custodyTokenPrice: u64,
    totalBorrowsInUsd: u64,
    liquidationFeeUsd: u64,
    liquidationTime: i64,
})

export interface RedeemStakeEvent {
    custody: string
    stakeAccount: string
    stakeInfo: string
    stakeRewards: bigint
    custodyTotalStakedAmount: bigint
    currentStakedAmount: bigint
    totalStakingRewards: bigint
    redeemTime: bigint
}

export const RedeemStakeEvent: Codec<RedeemStakeEvent> = struct({
    custody: address,
    stakeAccount: address,
    stakeInfo: address,
    stakeRewards: u64,
    custodyTotalStakedAmount: u64,
    currentStakedAmount: u64,
    totalStakingRewards: u64,
    redeemTime: i64,
})

export interface WithdrawStakeEvent {
    custody: string
    stakeAccount: string
    stakeInfo: string
    stakeRewards: bigint
    custodyTotalStakedAmount: bigint
    totalStakingRewards: bigint
    withdrawAmount: bigint
    withdrawTime: bigint
}

export const WithdrawStakeEvent: Codec<WithdrawStakeEvent> = struct({
    custody: address,
    stakeAccount: address,
    stakeInfo: address,
    stakeRewards: u64,
    custodyTotalStakedAmount: u64,
    totalStakingRewards: u64,
    withdrawAmount: u64,
    withdrawTime: i64,
})

export interface DelegateStakeEvent {
    custody: string
    stakeAccount: string
    stakeInfo: string
    custodyTotalStakedAmount: bigint
    stakeAmount: bigint
    validatorVoteAccount: string
    delegateTime: bigint
}

export const DelegateStakeEvent: Codec<DelegateStakeEvent> = struct({
    custody: address,
    stakeAccount: address,
    stakeInfo: address,
    custodyTotalStakedAmount: u64,
    stakeAmount: u64,
    validatorVoteAccount: address,
    delegateTime: i64,
})

export interface WithdrawFeesEvent {
    pool: string
    custody: string
    custodyMint: string
    receivingTokenAccount: string
    totalTradeSwapFees: bigint
    poolTradeSwapFees: bigint
    protocolTradeSwapFees: bigint
    totalBorrowLendingFees: bigint
    poolBorrowLendingFees: bigint
    protocolBorrowLendingFees: bigint
    poolTotalFeesUsd: bigint
    aprBpsBefore: bigint
    aprBpsAfter: bigint
    aprBpsUpdatedAt: bigint
    poolRealizedFeeUsdBefore: bigint
    poolRealizedFeeUsdAfter: bigint
    curtime: bigint
}

export const WithdrawFeesEvent: Codec<WithdrawFeesEvent> = struct({
    pool: address,
    custody: address,
    custodyMint: address,
    receivingTokenAccount: address,
    totalTradeSwapFees: u64,
    poolTradeSwapFees: u64,
    protocolTradeSwapFees: u64,
    totalBorrowLendingFees: u64,
    poolBorrowLendingFees: u64,
    protocolBorrowLendingFees: u64,
    poolTotalFeesUsd: u64,
    aprBpsBefore: u64,
    aprBpsAfter: u64,
    aprBpsUpdatedAt: i64,
    poolRealizedFeeUsdBefore: u64,
    poolRealizedFeeUsdAfter: u64,
    curtime: i64,
})
