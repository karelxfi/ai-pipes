import {address, array, binary, bool, i128, i16, i32, option, struct, u128, u16, u32, u64, u8, unit} from '@subsquid/borsh'
import {instruction} from '../abi.support.js'
import {AddressBool, InitVaultConfigParams, TransferType, UpdateCoreSettingsParams} from './types.js'

export type GetExchangePrices = undefined

export const getExchangePrices = instruction(
    {
        d8: '0xed8053983415e756',
    },
    {
        vaultState: 0,
        vaultConfig: 1,
        supplyTokenReserves: 2,
        borrowTokenReserves: 3,
    },
    unit,
)

export interface InitBranch {
    vaultId: number
    branchId: number
}

export const initBranch = instruction(
    {
        d8: '0xa25b3917e45d6f15',
    },
    {
        signer: 0,
        /**
         * @dev Verification inside instruction logic
         */
        vaultConfig: 1,
        branch: 2,
        systemProgram: 3,
    },
    struct({
        vaultId: u16,
        branchId: u32,
    }),
)

export interface InitPosition {
    vaultId: number
    nextPositionId: number
}

export const initPosition = instruction(
    {
        d8: '0xc5140a0161a0b15b',
    },
    {
        signer: 0,
        vaultAdmin: 1,
        /**
         * @dev Verification inside instruction logic
         */
        vaultState: 2,
        position: 3,
        positionMint: 4,
        positionTokenAccount: 5,
        metadataAccount: 6,
        tokenProgram: 7,
        associatedTokenProgram: 8,
        systemProgram: 9,
        sysvarInstruction: 10,
        metadataProgram: 11,
        rent: 12,
    },
    struct({
        vaultId: u16,
        nextPositionId: u32,
    }),
)

export interface InitTick {
    vaultId: number
    tick: number
}

export const initTick = instruction(
    {
        d8: '0x160d3e8d4959b21d',
    },
    {
        signer: 0,
        /**
         * @dev Verification inside instruction logic
         */
        vaultConfig: 1,
        tickData: 2,
        systemProgram: 3,
    },
    struct({
        vaultId: u16,
        tick: i32,
    }),
)

export interface InitTickHasDebtArray {
    vaultId: number
    index: number
}

export const initTickHasDebtArray = instruction(
    {
        d8: '0xce6c92f514008dd0',
    },
    {
        signer: 0,
        /**
         * @dev Verification inside instruction logic
         */
        vaultConfig: 1,
        tickHasDebtArray: 2,
        systemProgram: 3,
    },
    struct({
        vaultId: u16,
        index: u8,
    }),
)

export interface InitTickIdLiquidation {
    vaultId: number
    tick: number
    totalIds: number
}

export const initTickIdLiquidation = instruction(
    {
        d8: '0x386e79a998f156b7',
    },
    {
        signer: 0,
        /**
         * @dev Verification inside instruction logic
         */
        tickData: 1,
        tickIdLiquidation: 2,
        systemProgram: 3,
    },
    struct({
        vaultId: u16,
        tick: i32,
        totalIds: u32,
    }),
)

export interface InitVaultAdmin {
    liquidity: string
    authority: string
}

export const initVaultAdmin = instruction(
    {
        d8: '0x168502f47b64f9e6',
    },
    {
        signer: 0,
        vaultAdmin: 1,
        systemProgram: 2,
    },
    struct({
        liquidity: address,
        authority: address,
    }),
)

export interface InitVaultConfig {
    vaultId: number
    params: InitVaultConfigParams
}

export const initVaultConfig = instruction(
    {
        d8: '0x29c245fec4f6e2c3',
    },
    {
        authority: 0,
        vaultAdmin: 1,
        vaultConfig: 2,
        vaultMetadata: 3,
        oracle: 4,
        supplyToken: 5,
        borrowToken: 6,
        systemProgram: 7,
    },
    struct({
        vaultId: u16,
        params: InitVaultConfigParams,
    }),
)

export interface InitVaultState {
    vaultId: number
}

export const initVaultState = instruction(
    {
        d8: '0x60781764990b0da5',
    },
    {
        authority: 0,
        vaultAdmin: 1,
        /**
         * @dev Verification inside instruction logic
         */
        vaultConfig: 2,
        vaultState: 3,
        /**
         * @dev Verification inside instruction logic
         */
        supplyTokenReservesLiquidity: 4,
        /**
         * @dev Verification inside instruction logic
         */
        borrowTokenReservesLiquidity: 5,
        systemProgram: 6,
    },
    struct({
        vaultId: u16,
    }),
)

export interface Liquidate {
    debtAmt: bigint
    colPerUnitDebt: bigint
    absorb: boolean
    transferType?: TransferType | undefined
    remainingAccountsIndices: Uint8Array
}

export const liquidate = instruction(
    {
        d8: '0xdfb3e27d302e274a',
    },
    {
        signer: 0,
        signerTokenAccount: 1,
        to: 2,
        toTokenAccount: 3,
        /**
         * @dev mut because this PDA signs the CPI to liquidity program
         * @dev verification inside instruction logic
         */
        vaultConfig: 4,
        vaultState: 5,
        supplyToken: 6,
        borrowToken: 7,
        oracle: 8,
        newBranch: 9,
        supplyTokenReservesLiquidity: 10,
        borrowTokenReservesLiquidity: 11,
        vaultSupplyPositionOnLiquidity: 12,
        vaultBorrowPositionOnLiquidity: 13,
        supplyRateModel: 14,
        borrowRateModel: 15,
        supplyTokenClaimAccount: 16,
        liquidity: 17,
        liquidityProgram: 18,
        vaultSupplyTokenAccount: 19,
        vaultBorrowTokenAccount: 20,
        supplyTokenProgram: 21,
        borrowTokenProgram: 22,
        systemProgram: 23,
        associatedTokenProgram: 24,
        oracleProgram: 25,
    },
    struct({
        debtAmt: u64,
        colPerUnitDebt: u128,
        absorb: bool,
        transferType: option(TransferType),
        remainingAccountsIndices: binary,
    }),
)

export interface Operate {
    newCol: bigint
    newDebt: bigint
    transferType?: TransferType | undefined
    remainingAccountsIndices: Uint8Array
}

export const operate = instruction(
    {
        d8: '0xd96ad06374972a87',
    },
    {
        signer: 0,
        signerSupplyTokenAccount: 1,
        signerBorrowTokenAccount: 2,
        recipient: 3,
        recipientBorrowTokenAccount: 4,
        recipientSupplyTokenAccount: 5,
        /**
         * @dev mut because this PDA signs the CPI to liquidity program
         * @dev verification inside instruction logic
         */
        vaultConfig: 6,
        /**
         * @dev verification inside instruction logic
         */
        vaultState: 7,
        supplyToken: 8,
        borrowToken: 9,
        oracle: 10,
        position: 11,
        /**
         * @dev verification inside instruction logic
         */
        positionTokenAccount: 12,
        currentPositionTick: 13,
        finalPositionTick: 14,
        currentPositionTickId: 15,
        finalPositionTickId: 16,
        newBranch: 17,
        supplyTokenReservesLiquidity: 18,
        borrowTokenReservesLiquidity: 19,
        vaultSupplyPositionOnLiquidity: 20,
        vaultBorrowPositionOnLiquidity: 21,
        supplyRateModel: 22,
        borrowRateModel: 23,
        vaultSupplyTokenAccount: 24,
        vaultBorrowTokenAccount: 25,
        supplyTokenClaimAccount: 26,
        borrowTokenClaimAccount: 27,
        liquidity: 28,
        liquidityProgram: 29,
        oracleProgram: 30,
        supplyTokenProgram: 31,
        borrowTokenProgram: 32,
        associatedTokenProgram: 33,
        systemProgram: 34,
    },
    struct({
        newCol: i128,
        newDebt: i128,
        transferType: option(TransferType),
        remainingAccountsIndices: binary,
    }),
)

export type Rebalance = undefined

export const rebalance = instruction(
    {
        d8: '0x6c9e4d09d234583e',
    },
    {
        rebalancer: 0,
        rebalancerSupplyTokenAccount: 1,
        rebalancerBorrowTokenAccount: 2,
        /**
         * @dev mut because this PDA signs the CPI to liquidity program
         * @dev verification inside instruction logic
         */
        vaultConfig: 3,
        /**
         * @dev verification inside instruction logic
         */
        vaultState: 4,
        supplyToken: 5,
        borrowToken: 6,
        supplyTokenReservesLiquidity: 7,
        borrowTokenReservesLiquidity: 8,
        vaultSupplyPositionOnLiquidity: 9,
        vaultBorrowPositionOnLiquidity: 10,
        supplyRateModel: 11,
        borrowRateModel: 12,
        liquidity: 13,
        liquidityProgram: 14,
        vaultSupplyTokenAccount: 15,
        vaultBorrowTokenAccount: 16,
        systemProgram: 17,
        supplyTokenProgram: 18,
        borrowTokenProgram: 19,
        associatedTokenProgram: 20,
    },
    unit,
)

export interface UpdateAuthority {
    newAuthority: string
}

export const updateAuthority = instruction(
    {
        d8: '0x202e401c954bf358',
    },
    {
        signer: 0,
        vaultAdmin: 1,
    },
    struct({
        newAuthority: address,
    }),
)

export interface UpdateAuths {
    authStatus: Array<AddressBool>
}

export const updateAuths = instruction(
    {
        d8: '0x5d60b29c3975fdd1',
    },
    {
        signer: 0,
        vaultAdmin: 1,
    },
    struct({
        authStatus: array(AddressBool),
    }),
)

export interface UpdateBorrowFee {
    vaultId: number
    borrowFee: number
}

export const updateBorrowFee = instruction(
    {
        d8: '0xfb7c2394caa79d41',
    },
    {
        authority: 0,
        vaultAdmin: 1,
        /**
         * @dev Verification inside instruction logic
         */
        vaultState: 2,
        /**
         * @dev Verification inside instruction logic
         */
        vaultConfig: 3,
        /**
         * @dev Verification inside instruction logic
         */
        supplyTokenReservesLiquidity: 4,
        /**
         * @dev Verification inside instruction logic
         */
        borrowTokenReservesLiquidity: 5,
    },
    struct({
        vaultId: u16,
        borrowFee: u16,
    }),
)

export interface UpdateBorrowRateMagnifier {
    vaultId: number
    borrowRateMagnifier: number
}

export const updateBorrowRateMagnifier = instruction(
    {
        d8: '0x4bfa1bb09c351a70',
    },
    {
        authority: 0,
        vaultAdmin: 1,
        /**
         * @dev Verification inside instruction logic
         */
        vaultState: 2,
        /**
         * @dev Verification inside instruction logic
         */
        vaultConfig: 3,
        /**
         * @dev Verification inside instruction logic
         */
        supplyTokenReservesLiquidity: 4,
        /**
         * @dev Verification inside instruction logic
         */
        borrowTokenReservesLiquidity: 5,
    },
    struct({
        vaultId: u16,
        borrowRateMagnifier: i16,
    }),
)

export interface UpdateCollateralFactor {
    vaultId: number
    collateralFactor: number
}

export const updateCollateralFactor = instruction(
    {
        d8: '0xf453e3d7dc52c9dd',
    },
    {
        authority: 0,
        vaultAdmin: 1,
        /**
         * @dev Verification inside instruction logic
         */
        vaultState: 2,
        /**
         * @dev Verification inside instruction logic
         */
        vaultConfig: 3,
        /**
         * @dev Verification inside instruction logic
         */
        supplyTokenReservesLiquidity: 4,
        /**
         * @dev Verification inside instruction logic
         */
        borrowTokenReservesLiquidity: 5,
    },
    struct({
        vaultId: u16,
        collateralFactor: u16,
    }),
)

export interface UpdateCoreSettings {
    vaultId: number
    params: UpdateCoreSettingsParams
}

export const updateCoreSettings = instruction(
    {
        d8: '0x6554090b3c6895ea',
    },
    {
        authority: 0,
        vaultAdmin: 1,
        /**
         * @dev Verification inside instruction logic
         */
        vaultState: 2,
        /**
         * @dev Verification inside instruction logic
         */
        vaultConfig: 3,
        /**
         * @dev Verification inside instruction logic
         */
        supplyTokenReservesLiquidity: 4,
        /**
         * @dev Verification inside instruction logic
         */
        borrowTokenReservesLiquidity: 5,
    },
    struct({
        vaultId: u16,
        params: UpdateCoreSettingsParams,
    }),
)

export interface UpdateExchangePrices {
    vaultId: number
}

export const updateExchangePrices = instruction(
    {
        d8: '0xd10ebc5ff21477c4',
    },
    {
        /**
         * @dev Verification inside instruction logic
         */
        vaultState: 0,
        /**
         * @dev Verification inside instruction logic
         */
        vaultConfig: 1,
        /**
         * @dev Verification inside instruction logic
         */
        supplyTokenReservesLiquidity: 2,
        /**
         * @dev Verification inside instruction logic
         */
        borrowTokenReservesLiquidity: 3,
    },
    struct({
        vaultId: u16,
    }),
)

export interface UpdateLiquidationMaxLimit {
    vaultId: number
    liquidationMaxLimit: number
}

export const updateLiquidationMaxLimit = instruction(
    {
        d8: '0xb7f29896b02841a1',
    },
    {
        authority: 0,
        vaultAdmin: 1,
        /**
         * @dev Verification inside instruction logic
         */
        vaultState: 2,
        /**
         * @dev Verification inside instruction logic
         */
        vaultConfig: 3,
        /**
         * @dev Verification inside instruction logic
         */
        supplyTokenReservesLiquidity: 4,
        /**
         * @dev Verification inside instruction logic
         */
        borrowTokenReservesLiquidity: 5,
    },
    struct({
        vaultId: u16,
        liquidationMaxLimit: u16,
    }),
)

export interface UpdateLiquidationPenalty {
    vaultId: number
    liquidationPenalty: number
}

export const updateLiquidationPenalty = instruction(
    {
        d8: '0x15a8a7ce62ce4520',
    },
    {
        authority: 0,
        vaultAdmin: 1,
        /**
         * @dev Verification inside instruction logic
         */
        vaultState: 2,
        /**
         * @dev Verification inside instruction logic
         */
        vaultConfig: 3,
        /**
         * @dev Verification inside instruction logic
         */
        supplyTokenReservesLiquidity: 4,
        /**
         * @dev Verification inside instruction logic
         */
        borrowTokenReservesLiquidity: 5,
    },
    struct({
        vaultId: u16,
        liquidationPenalty: u16,
    }),
)

export interface UpdateLiquidationThreshold {
    vaultId: number
    liquidationThreshold: number
}

export const updateLiquidationThreshold = instruction(
    {
        d8: '0x35b957f38a0b4f1c',
    },
    {
        authority: 0,
        vaultAdmin: 1,
        /**
         * @dev Verification inside instruction logic
         */
        vaultState: 2,
        /**
         * @dev Verification inside instruction logic
         */
        vaultConfig: 3,
        /**
         * @dev Verification inside instruction logic
         */
        supplyTokenReservesLiquidity: 4,
        /**
         * @dev Verification inside instruction logic
         */
        borrowTokenReservesLiquidity: 5,
    },
    struct({
        vaultId: u16,
        liquidationThreshold: u16,
    }),
)

export interface UpdateLookupTable {
    vaultId: number
    lookupTable: string
}

export const updateLookupTable = instruction(
    {
        d8: '0xdd3b1ef66adf8937',
    },
    {
        authority: 0,
        vaultAdmin: 1,
        /**
         * @dev Verification inside instruction logic
         */
        vaultMetadata: 2,
    },
    struct({
        vaultId: u16,
        lookupTable: address,
    }),
)

export interface UpdateOracle {
    vaultId: number
}

export const updateOracle = instruction(
    {
        d8: '0x7029d112f8e2fcbc',
    },
    {
        authority: 0,
        vaultAdmin: 1,
        /**
         * @dev Verification inside instruction logic
         */
        vaultState: 2,
        /**
         * @dev Verification inside instruction logic
         */
        vaultConfig: 3,
        newOracle: 4,
        /**
         * @dev Verification inside instruction logic
         */
        supplyTokenReservesLiquidity: 5,
        /**
         * @dev Verification inside instruction logic
         */
        borrowTokenReservesLiquidity: 6,
    },
    struct({
        vaultId: u16,
    }),
)

export interface UpdateRebalancer {
    vaultId: number
    newRebalancer: string
}

export const updateRebalancer = instruction(
    {
        d8: '0xcebb36e49108cb6f',
    },
    {
        authority: 0,
        vaultAdmin: 1,
        /**
         * @dev Verification inside instruction logic
         */
        vaultState: 2,
        /**
         * @dev Verification inside instruction logic
         */
        vaultConfig: 3,
        /**
         * @dev Verification inside instruction logic
         */
        supplyTokenReservesLiquidity: 4,
        /**
         * @dev Verification inside instruction logic
         */
        borrowTokenReservesLiquidity: 5,
    },
    struct({
        vaultId: u16,
        newRebalancer: address,
    }),
)

export interface UpdateSupplyRateMagnifier {
    vaultId: number
    supplyRateMagnifier: number
}

export const updateSupplyRateMagnifier = instruction(
    {
        d8: '0xaf3b75c4d3aa160c',
    },
    {
        authority: 0,
        vaultAdmin: 1,
        /**
         * @dev Verification inside instruction logic
         */
        vaultState: 2,
        /**
         * @dev Verification inside instruction logic
         */
        vaultConfig: 3,
        /**
         * @dev Verification inside instruction logic
         */
        supplyTokenReservesLiquidity: 4,
        /**
         * @dev Verification inside instruction logic
         */
        borrowTokenReservesLiquidity: 5,
    },
    struct({
        vaultId: u16,
        supplyRateMagnifier: i16,
    }),
)

export interface UpdateWithdrawGap {
    vaultId: number
    withdrawGap: number
}

export const updateWithdrawGap = instruction(
    {
        d8: '0xe5a34c1552d719e9',
    },
    {
        authority: 0,
        vaultAdmin: 1,
        /**
         * @dev Verification inside instruction logic
         */
        vaultState: 2,
        /**
         * @dev Verification inside instruction logic
         */
        vaultConfig: 3,
        /**
         * @dev Verification inside instruction logic
         */
        supplyTokenReservesLiquidity: 4,
        /**
         * @dev Verification inside instruction logic
         */
        borrowTokenReservesLiquidity: 5,
    },
    struct({
        vaultId: u16,
        withdrawGap: u16,
    }),
)
