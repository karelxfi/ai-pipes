import {Codec, address, array, bool, fixedArray, i128, i16, i32, struct, sum, u128, u16, u32, u64, u8, unit} from '@subsquid/borsh'

export interface AddressBool {
    addr: string
    value: boolean
}

export const AddressBool: Codec<AddressBool> = struct({
    addr: address,
    value: bool,
})

/**
 * Branch data structure
 */
export interface Branch {
    vaultId: number
    branchId: number
    status: number
    minimaTick: number
    minimaTickPartials: number
    debtLiquidity: bigint
    debtFactor: bigint
    connectedBranchId: number
    connectedMinimaTick: number
}

/**
 * Branch data structure
 */
export const Branch: Codec<Branch> = struct({
    vaultId: u16,
    branchId: u32,
    status: u8,
    minimaTick: i32,
    minimaTickPartials: u32,
    debtLiquidity: u64,
    debtFactor: u64,
    connectedBranchId: u32,
    connectedMinimaTick: i32,
})

export interface InitVaultConfigParams {
    supplyRateMagnifier: number
    borrowRateMagnifier: number
    collateralFactor: number
    liquidationThreshold: number
    liquidationMaxLimit: number
    withdrawGap: number
    liquidationPenalty: number
    borrowFee: number
    rebalancer: string
    liquidityProgram: string
    oracleProgram: string
}

export const InitVaultConfigParams: Codec<InitVaultConfigParams> = struct({
    supplyRateMagnifier: i16,
    borrowRateMagnifier: i16,
    collateralFactor: u16,
    liquidationThreshold: u16,
    liquidationMaxLimit: u16,
    withdrawGap: u16,
    liquidationPenalty: u16,
    borrowFee: u16,
    rebalancer: address,
    liquidityProgram: address,
    oracleProgram: address,
})

export interface LogAbsorb {
    colAmount: bigint
    debtAmount: bigint
}

export const LogAbsorb: Codec<LogAbsorb> = struct({
    colAmount: u64,
    debtAmount: u64,
})

export interface LogClosePosition {
    signer: string
    positionId: number
    vaultId: number
    positionMint: string
}

export const LogClosePosition: Codec<LogClosePosition> = struct({
    signer: address,
    positionId: u32,
    vaultId: u16,
    positionMint: address,
})

export interface LogInitBranch {
    branch: string
    branchId: number
}

export const LogInitBranch: Codec<LogInitBranch> = struct({
    branch: address,
    branchId: u32,
})

export interface LogInitTick {
    tick: string
}

export const LogInitTick: Codec<LogInitTick> = struct({
    tick: address,
})

export interface LogInitTickHasDebtArray {
    tickHasDebtArray: string
}

export const LogInitTickHasDebtArray: Codec<LogInitTickHasDebtArray> = struct({
    tickHasDebtArray: address,
})

export interface LogInitTickIdLiquidation {
    tickIdLiquidation: string
    tick: number
}

export const LogInitTickIdLiquidation: Codec<LogInitTickIdLiquidation> = struct({
    tickIdLiquidation: address,
    tick: i32,
})

export interface LogInitVaultConfig {
    vaultConfig: string
}

export const LogInitVaultConfig: Codec<LogInitVaultConfig> = struct({
    vaultConfig: address,
})

export interface LogInitVaultState {
    vaultState: string
}

export const LogInitVaultState: Codec<LogInitVaultState> = struct({
    vaultState: address,
})

export interface LogLiquidate {
    signer: string
    colAmount: bigint
    debtAmount: bigint
    to: string
}

export const LogLiquidate: Codec<LogLiquidate> = struct({
    signer: address,
    colAmount: u64,
    debtAmount: u64,
    to: address,
})

export interface LogLiquidateInfo {
    vaultId: number
    startTick: number
    endTick: number
}

export const LogLiquidateInfo: Codec<LogLiquidateInfo> = struct({
    vaultId: u16,
    startTick: i32,
    endTick: i32,
})

export interface LogLiquidationRoundingDiff {
    vaultId: number
    actualDebtAmt: bigint
    debtAmount: bigint
    diff: bigint
}

export const LogLiquidationRoundingDiff: Codec<LogLiquidationRoundingDiff> = struct({
    vaultId: u16,
    actualDebtAmt: u64,
    debtAmount: u64,
    diff: u64,
})

export interface LogOperate {
    signer: string
    nftId: number
    newCol: bigint
    newDebt: bigint
    to: string
}

export const LogOperate: Codec<LogOperate> = struct({
    signer: address,
    nftId: u32,
    newCol: i128,
    newDebt: i128,
    to: address,
})

export interface LogRebalance {
    supplyAmt: bigint
    borrowAmt: bigint
}

export const LogRebalance: Codec<LogRebalance> = struct({
    supplyAmt: i128,
    borrowAmt: i128,
})

export interface LogUpdateAuthority {
    newAuthority: string
}

export const LogUpdateAuthority: Codec<LogUpdateAuthority> = struct({
    newAuthority: address,
})

export interface LogUpdateAuths {
    authStatus: Array<AddressBool>
}

export const LogUpdateAuths: Codec<LogUpdateAuths> = struct({
    authStatus: array(AddressBool),
})

export interface LogUpdateBorrowFee {
    borrowFee: number
}

export const LogUpdateBorrowFee: Codec<LogUpdateBorrowFee> = struct({
    borrowFee: u16,
})

export interface LogUpdateBorrowRateMagnifier {
    borrowRateMagnifier: number
}

export const LogUpdateBorrowRateMagnifier: Codec<LogUpdateBorrowRateMagnifier> = struct({
    borrowRateMagnifier: i16,
})

export interface LogUpdateCollateralFactor {
    collateralFactor: number
}

export const LogUpdateCollateralFactor: Codec<LogUpdateCollateralFactor> = struct({
    collateralFactor: u16,
})

export interface LogUpdateCoreSettings {
    supplyRateMagnifier: number
    borrowRateMagnifier: number
    collateralFactor: number
    liquidationThreshold: number
    liquidationMaxLimit: number
    withdrawGap: number
    liquidationPenalty: number
    borrowFee: number
}

export const LogUpdateCoreSettings: Codec<LogUpdateCoreSettings> = struct({
    supplyRateMagnifier: i16,
    borrowRateMagnifier: i16,
    collateralFactor: u16,
    liquidationThreshold: u16,
    liquidationMaxLimit: u16,
    withdrawGap: u16,
    liquidationPenalty: u16,
    borrowFee: u16,
})

export interface LogUpdateExchangePrices {
    vaultSupplyExchangePrice: bigint
    vaultBorrowExchangePrice: bigint
    liquiditySupplyExchangePrice: bigint
    liquidityBorrowExchangePrice: bigint
}

export const LogUpdateExchangePrices: Codec<LogUpdateExchangePrices> = struct({
    vaultSupplyExchangePrice: u64,
    vaultBorrowExchangePrice: u64,
    liquiditySupplyExchangePrice: u64,
    liquidityBorrowExchangePrice: u64,
})

export interface LogUpdateLiquidationMaxLimit {
    liquidationMaxLimit: number
}

export const LogUpdateLiquidationMaxLimit: Codec<LogUpdateLiquidationMaxLimit> = struct({
    liquidationMaxLimit: u16,
})

export interface LogUpdateLiquidationPenalty {
    liquidationPenalty: number
}

export const LogUpdateLiquidationPenalty: Codec<LogUpdateLiquidationPenalty> = struct({
    liquidationPenalty: u16,
})

export interface LogUpdateLiquidationThreshold {
    liquidationThreshold: number
}

export const LogUpdateLiquidationThreshold: Codec<LogUpdateLiquidationThreshold> = struct({
    liquidationThreshold: u16,
})

export interface LogUpdateLookupTable {
    lookupTable: string
}

export const LogUpdateLookupTable: Codec<LogUpdateLookupTable> = struct({
    lookupTable: address,
})

export interface LogUpdateOracle {
    newOracle: string
}

export const LogUpdateOracle: Codec<LogUpdateOracle> = struct({
    newOracle: address,
})

export interface LogUpdateRebalancer {
    newRebalancer: string
}

export const LogUpdateRebalancer: Codec<LogUpdateRebalancer> = struct({
    newRebalancer: address,
})

export interface LogUpdateSupplyRateMagnifier {
    supplyRateMagnifier: number
}

export const LogUpdateSupplyRateMagnifier: Codec<LogUpdateSupplyRateMagnifier> = struct({
    supplyRateMagnifier: i16,
})

export interface LogUpdateWithdrawGap {
    withdrawGap: number
}

export const LogUpdateWithdrawGap: Codec<LogUpdateWithdrawGap> = struct({
    withdrawGap: u16,
})

export interface LogUserPosition {
    user: string
    nftId: number
    vaultId: number
    positionMint: string
    tick: number
    col: bigint
    borrow: bigint
}

export const LogUserPosition: Codec<LogUserPosition> = struct({
    user: address,
    nftId: u32,
    vaultId: u16,
    positionMint: address,
    tick: i32,
    col: u64,
    borrow: u64,
})

export type SourceType_Pyth = undefined

export const SourceType_Pyth = unit

export type SourceType_StakePool = undefined

export const SourceType_StakePool = unit

export type SourceType_MsolPool = undefined

export const SourceType_MsolPool = unit

export type SourceType_Redstone = undefined

export const SourceType_Redstone = unit

export type SourceType_Chainlink = undefined

export const SourceType_Chainlink = unit

export type SourceType_SinglePool = undefined

export const SourceType_SinglePool = unit

export type SourceType_JupLend = undefined

export const SourceType_JupLend = unit

export type SourceType_ChainlinkDataStreams = undefined

export const SourceType_ChainlinkDataStreams = unit

export type SourceType = 
    | {
        kind: 'Pyth'
        value?: SourceType_Pyth
      }
    | {
        kind: 'StakePool'
        value?: SourceType_StakePool
      }
    | {
        kind: 'MsolPool'
        value?: SourceType_MsolPool
      }
    | {
        kind: 'Redstone'
        value?: SourceType_Redstone
      }
    | {
        kind: 'Chainlink'
        value?: SourceType_Chainlink
      }
    | {
        kind: 'SinglePool'
        value?: SourceType_SinglePool
      }
    | {
        kind: 'JupLend'
        value?: SourceType_JupLend
      }
    | {
        kind: 'ChainlinkDataStreams'
        value?: SourceType_ChainlinkDataStreams
      }

export const SourceType: Codec<SourceType> = sum(1, {
    Pyth: {
        discriminator: 0,
        value: SourceType_Pyth,
    },
    StakePool: {
        discriminator: 1,
        value: SourceType_StakePool,
    },
    MsolPool: {
        discriminator: 2,
        value: SourceType_MsolPool,
    },
    Redstone: {
        discriminator: 3,
        value: SourceType_Redstone,
    },
    Chainlink: {
        discriminator: 4,
        value: SourceType_Chainlink,
    },
    SinglePool: {
        discriminator: 5,
        value: SourceType_SinglePool,
    },
    JupLend: {
        discriminator: 6,
        value: SourceType_JupLend,
    },
    ChainlinkDataStreams: {
        discriminator: 7,
        value: SourceType_ChainlinkDataStreams,
    },
})

export interface Sources {
    source: string
    invert: boolean
    multiplier: bigint
    divisor: bigint
    sourceType: SourceType
}

export const Sources: Codec<Sources> = struct({
    source: address,
    invert: bool,
    multiplier: u128,
    divisor: u128,
    sourceType: SourceType,
})

export interface Oracle {
    nonce: number
    sources: Array<Sources>
    bump: number
}

export const Oracle: Codec<Oracle> = struct({
    nonce: u16,
    sources: array(Sources),
    bump: u8,
})

/**
 * Position data structure
 */
export interface Position {
    vaultId: number
    nftId: number
    positionMint: string
    isSupplyOnlyPosition: number
    tick: number
    tickId: number
    supplyAmount: bigint
    dustDebtAmount: bigint
}

/**
 * Position data structure
 */
export const Position: Codec<Position> = struct({
    vaultId: u16,
    nftId: u32,
    positionMint: address,
    isSupplyOnlyPosition: u8,
    tick: i32,
    tickId: u32,
    supplyAmount: u64,
    dustDebtAmount: u64,
})

/**
 * Tick data structure
 */
export interface Tick {
    vaultId: number
    tick: number
    isLiquidated: number
    totalIds: number
    rawDebt: bigint
    isFullyLiquidated: number
    liquidationBranchId: number
    debtFactor: bigint
}

/**
 * Tick data structure
 */
export const Tick: Codec<Tick> = struct({
    vaultId: u16,
    tick: i32,
    isLiquidated: u8,
    totalIds: u32,
    rawDebt: u64,
    isFullyLiquidated: u8,
    liquidationBranchId: u32,
    debtFactor: u64,
})

/**
 * Tick has debt structure
 * Each TickHasDebt can track 8 * 256 = 2048 ticks
 * children_bits has 32 bytes = 256 bits total
 * Each map within the array covers 256 ticks
 */
export interface TickHasDebt {
    childrenBits: Array<number>
}

/**
 * Tick has debt structure
 * Each TickHasDebt can track 8 * 256 = 2048 ticks
 * children_bits has 32 bytes = 256 bits total
 * Each map within the array covers 256 ticks
 */
export const TickHasDebt: Codec<TickHasDebt> = struct({
    childrenBits: fixedArray(u8, 32),
})

export interface TickHasDebtArray {
    vaultId: number
    index: number
    tickHasDebt: Array<TickHasDebt>
}

export const TickHasDebtArray: Codec<TickHasDebtArray> = struct({
    vaultId: u16,
    index: u8,
    tickHasDebt: fixedArray(TickHasDebt, 8),
})

/**
 * Tick ID liquidation data
 */
export interface TickIdLiquidation {
    vaultId: number
    tick: number
    tickMap: number
    isFullyLiquidated1: number
    liquidationBranchId1: number
    debtFactor1: bigint
    isFullyLiquidated2: number
    liquidationBranchId2: number
    debtFactor2: bigint
    isFullyLiquidated3: number
    liquidationBranchId3: number
    debtFactor3: bigint
}

/**
 * Tick ID liquidation data
 */
export const TickIdLiquidation: Codec<TickIdLiquidation> = struct({
    vaultId: u16,
    tick: i32,
    tickMap: u32,
    isFullyLiquidated1: u8,
    liquidationBranchId1: u32,
    debtFactor1: u64,
    isFullyLiquidated2: u8,
    liquidationBranchId2: u32,
    debtFactor2: u64,
    isFullyLiquidated3: u8,
    liquidationBranchId3: u32,
    debtFactor3: u64,
})

/**
 * Token configuration and exchange prices
 */
export interface TokenReserve {
    mint: string
    vault: string
    borrowRate: number
    feeOnInterest: number
    lastUtilization: number
    lastUpdateTimestamp: bigint
    supplyExchangePrice: bigint
    borrowExchangePrice: bigint
    maxUtilization: number
    totalSupplyWithInterest: bigint
    totalSupplyInterestFree: bigint
    totalBorrowWithInterest: bigint
    totalBorrowInterestFree: bigint
    totalClaimAmount: bigint
    interactingProtocol: string
    interactingTimestamp: bigint
    interactingBalance: bigint
}

/**
 * Token configuration and exchange prices
 */
export const TokenReserve: Codec<TokenReserve> = struct({
    mint: address,
    vault: address,
    borrowRate: u16,
    feeOnInterest: u16,
    lastUtilization: u16,
    lastUpdateTimestamp: u64,
    supplyExchangePrice: u64,
    borrowExchangePrice: u64,
    maxUtilization: u16,
    totalSupplyWithInterest: u64,
    totalSupplyInterestFree: u64,
    totalBorrowWithInterest: u64,
    totalBorrowInterestFree: u64,
    totalClaimAmount: u64,
    interactingProtocol: address,
    interactingTimestamp: u64,
    interactingBalance: u64,
})

export type TransferType_SKIP = undefined

export const TransferType_SKIP = unit

export type TransferType_DIRECT = undefined

export const TransferType_DIRECT = unit

export type TransferType_CLAIM = undefined

export const TransferType_CLAIM = unit

export type TransferType = 
    | {
        kind: 'SKIP'
        value?: TransferType_SKIP
      }
    | {
        kind: 'DIRECT'
        value?: TransferType_DIRECT
      }
    | {
        kind: 'CLAIM'
        value?: TransferType_CLAIM
      }

export const TransferType: Codec<TransferType> = sum(1, {
    SKIP: {
        discriminator: 0,
        value: TransferType_SKIP,
    },
    DIRECT: {
        discriminator: 1,
        value: TransferType_DIRECT,
    },
    CLAIM: {
        discriminator: 2,
        value: TransferType_CLAIM,
    },
})

export interface UpdateCoreSettingsParams {
    supplyRateMagnifier: number
    borrowRateMagnifier: number
    collateralFactor: number
    liquidationThreshold: number
    liquidationMaxLimit: number
    withdrawGap: number
    liquidationPenalty: number
    borrowFee: number
}

export const UpdateCoreSettingsParams: Codec<UpdateCoreSettingsParams> = struct({
    supplyRateMagnifier: i16,
    borrowRateMagnifier: i16,
    collateralFactor: u16,
    liquidationThreshold: u16,
    liquidationMaxLimit: u16,
    withdrawGap: u16,
    liquidationPenalty: u16,
    borrowFee: u16,
})

/**
 * User borrow position
 */
export interface UserBorrowPosition {
    protocol: string
    mint: string
    withInterest: number
    amount: bigint
    debtCeiling: bigint
    lastUpdate: bigint
    expandPct: number
    expandDuration: number
    baseDebtCeiling: bigint
    maxDebtCeiling: bigint
    status: number
}

/**
 * User borrow position
 */
export const UserBorrowPosition: Codec<UserBorrowPosition> = struct({
    protocol: address,
    mint: address,
    withInterest: u8,
    amount: u64,
    debtCeiling: u64,
    lastUpdate: u64,
    expandPct: u16,
    expandDuration: u32,
    baseDebtCeiling: u64,
    maxDebtCeiling: u64,
    status: u8,
})

/**
 * User supply position
 */
export interface UserSupplyPosition {
    protocol: string
    mint: string
    withInterest: number
    amount: bigint
    withdrawalLimit: bigint
    lastUpdate: bigint
    expandPct: number
    expandDuration: bigint
    baseWithdrawalLimit: bigint
    status: number
}

/**
 * User supply position
 */
export const UserSupplyPosition: Codec<UserSupplyPosition> = struct({
    protocol: address,
    mint: address,
    withInterest: u8,
    amount: u64,
    withdrawalLimit: u128,
    lastUpdate: u64,
    expandPct: u16,
    expandDuration: u64,
    baseWithdrawalLimit: u64,
    status: u8,
})

export interface VaultAdmin {
    authority: string
    liquidityProgram: string
    nextVaultId: number
    auths: Array<string>
    bump: number
}

export const VaultAdmin: Codec<VaultAdmin> = struct({
    authority: address,
    liquidityProgram: address,
    nextVaultId: u16,
    auths: array(address),
    bump: u8,
})

export interface VaultConfig {
    vaultId: number
    supplyRateMagnifier: number
    borrowRateMagnifier: number
    collateralFactor: number
    liquidationThreshold: number
    liquidationMaxLimit: number
    withdrawGap: number
    liquidationPenalty: number
    borrowFee: number
    oracle: string
    rebalancer: string
    liquidityProgram: string
    oracleProgram: string
    supplyToken: string
    borrowToken: string
    bump: number
}

export const VaultConfig: Codec<VaultConfig> = struct({
    vaultId: u16,
    supplyRateMagnifier: i16,
    borrowRateMagnifier: i16,
    collateralFactor: u16,
    liquidationThreshold: u16,
    liquidationMaxLimit: u16,
    withdrawGap: u16,
    liquidationPenalty: u16,
    borrowFee: u16,
    oracle: address,
    rebalancer: address,
    liquidityProgram: address,
    oracleProgram: address,
    supplyToken: address,
    borrowToken: address,
    bump: u8,
})

export interface VaultMetadata {
    vaultId: number
    lookupTable: string
    supplyMintDecimals: number
    borrowMintDecimals: number
}

export const VaultMetadata: Codec<VaultMetadata> = struct({
    vaultId: u16,
    lookupTable: address,
    supplyMintDecimals: u8,
    borrowMintDecimals: u8,
})

export interface VaultState {
    vaultId: number
    branchLiquidated: number
    topmostTick: number
    currentBranchId: number
    totalBranchId: number
    totalSupply: bigint
    totalBorrow: bigint
    totalPositions: number
    absorbedDebtAmount: bigint
    absorbedColAmount: bigint
    absorbedDustDebt: bigint
    liquiditySupplyExchangePrice: bigint
    liquidityBorrowExchangePrice: bigint
    vaultSupplyExchangePrice: bigint
    vaultBorrowExchangePrice: bigint
    nextPositionId: number
    lastUpdateTimestamp: bigint
}

export const VaultState: Codec<VaultState> = struct({
    vaultId: u16,
    branchLiquidated: u8,
    topmostTick: i32,
    currentBranchId: u32,
    totalBranchId: u32,
    totalSupply: u64,
    totalBorrow: u64,
    totalPositions: u32,
    absorbedDebtAmount: u128,
    absorbedColAmount: u128,
    absorbedDustDebt: u64,
    liquiditySupplyExchangePrice: u64,
    liquidityBorrowExchangePrice: u64,
    vaultSupplyExchangePrice: u64,
    vaultBorrowExchangePrice: u64,
    nextPositionId: u32,
    lastUpdateTimestamp: u64,
})
