import {address, array, string, struct, u64, unit} from '@subsquid/borsh'
import {instruction} from '../abi.support.js'
import {AddressBool} from './types.js'

export interface Deposit {
    assets: bigint
}

export const deposit = instruction(
    {
        d8: '0xf223c68952e1f2b6',
    },
    {
        signer: 0,
        depositorTokenAccount: 1,
        recipientTokenAccount: 2,
        mint: 3,
        lendingAdmin: 4,
        lending: 5,
        fTokenMint: 6,
        supplyTokenReservesLiquidity: 7,
        lendingSupplyPositionOnLiquidity: 8,
        rateModel: 9,
        vault: 10,
        liquidity: 11,
        liquidityProgram: 12,
        rewardsRateModel: 13,
        tokenProgram: 14,
        associatedTokenProgram: 15,
        systemProgram: 16,
    },
    struct({
        assets: u64,
    }),
)

export interface DepositWithMinAmountOut {
    assets: bigint
    minAmountOut: bigint
}

export const depositWithMinAmountOut = instruction(
    {
        d8: '0x74901061766d2877',
    },
    {
        signer: 0,
        depositorTokenAccount: 1,
        recipientTokenAccount: 2,
        mint: 3,
        lendingAdmin: 4,
        lending: 5,
        fTokenMint: 6,
        supplyTokenReservesLiquidity: 7,
        lendingSupplyPositionOnLiquidity: 8,
        rateModel: 9,
        vault: 10,
        liquidity: 11,
        liquidityProgram: 12,
        rewardsRateModel: 13,
        tokenProgram: 14,
        associatedTokenProgram: 15,
        systemProgram: 16,
    },
    struct({
        assets: u64,
        minAmountOut: u64,
    }),
)

export interface InitLending {
    symbol: string
    liquidityProgram: string
}

export const initLending = instruction(
    {
        d8: '0x9ce0432e59bd9dd1',
    },
    {
        signer: 0,
        lendingAdmin: 1,
        mint: 2,
        fTokenMint: 3,
        metadataAccount: 4,
        lending: 5,
        tokenReservesLiquidity: 6,
        tokenProgram: 7,
        systemProgram: 8,
        sysvarInstruction: 9,
        metadataProgram: 10,
        rent: 11,
    },
    struct({
        symbol: string,
        liquidityProgram: address,
    }),
)

export interface InitLendingAdmin {
    liquidityProgram: string
    rebalancer: string
    authority: string
}

export const initLendingAdmin = instruction(
    {
        d8: '0xcbb9f1a538fe2109',
    },
    {
        authority: 0,
        lendingAdmin: 1,
        systemProgram: 2,
    },
    struct({
        liquidityProgram: address,
        rebalancer: address,
        authority: address,
    }),
)

export interface Mint {
    shares: bigint
}

export const mint = instruction(
    {
        d8: '0x3339e12fb69289a6',
    },
    {
        signer: 0,
        depositorTokenAccount: 1,
        recipientTokenAccount: 2,
        mint: 3,
        lendingAdmin: 4,
        lending: 5,
        fTokenMint: 6,
        supplyTokenReservesLiquidity: 7,
        lendingSupplyPositionOnLiquidity: 8,
        rateModel: 9,
        vault: 10,
        liquidity: 11,
        liquidityProgram: 12,
        rewardsRateModel: 13,
        tokenProgram: 14,
        associatedTokenProgram: 15,
        systemProgram: 16,
    },
    struct({
        shares: u64,
    }),
)

export interface MintWithMaxAssets {
    shares: bigint
    maxAssets: bigint
}

export const mintWithMaxAssets = instruction(
    {
        d8: '0x065e457a1eb392ab',
    },
    {
        signer: 0,
        depositorTokenAccount: 1,
        recipientTokenAccount: 2,
        mint: 3,
        lendingAdmin: 4,
        lending: 5,
        fTokenMint: 6,
        supplyTokenReservesLiquidity: 7,
        lendingSupplyPositionOnLiquidity: 8,
        rateModel: 9,
        vault: 10,
        liquidity: 11,
        liquidityProgram: 12,
        rewardsRateModel: 13,
        tokenProgram: 14,
        associatedTokenProgram: 15,
        systemProgram: 16,
    },
    struct({
        shares: u64,
        maxAssets: u64,
    }),
)

export type Rebalance = undefined

export const rebalance = instruction(
    {
        d8: '0x6c9e4d09d234583e',
    },
    {
        signer: 0,
        depositorTokenAccount: 1,
        lendingAdmin: 2,
        lending: 3,
        mint: 4,
        fTokenMint: 5,
        supplyTokenReservesLiquidity: 6,
        lendingSupplyPositionOnLiquidity: 7,
        rateModel: 8,
        vault: 9,
        liquidity: 10,
        liquidityProgram: 11,
        rewardsRateModel: 12,
        tokenProgram: 13,
        associatedTokenProgram: 14,
        systemProgram: 15,
    },
    unit,
)

export interface Redeem {
    shares: bigint
}

export const redeem = instruction(
    {
        d8: '0xb80c569546c461e1',
    },
    {
        signer: 0,
        ownerTokenAccount: 1,
        recipientTokenAccount: 2,
        lendingAdmin: 3,
        lending: 4,
        mint: 5,
        fTokenMint: 6,
        supplyTokenReservesLiquidity: 7,
        lendingSupplyPositionOnLiquidity: 8,
        rateModel: 9,
        vault: 10,
        claimAccount: 11,
        liquidity: 12,
        liquidityProgram: 13,
        rewardsRateModel: 14,
        tokenProgram: 15,
        associatedTokenProgram: 16,
        systemProgram: 17,
    },
    struct({
        shares: u64,
    }),
)

export interface RedeemWithMinAmountOut {
    shares: bigint
    minAmountOut: bigint
}

export const redeemWithMinAmountOut = instruction(
    {
        d8: '0xebbded38a6b4b895',
    },
    {
        signer: 0,
        ownerTokenAccount: 1,
        recipientTokenAccount: 2,
        lendingAdmin: 3,
        lending: 4,
        mint: 5,
        fTokenMint: 6,
        supplyTokenReservesLiquidity: 7,
        lendingSupplyPositionOnLiquidity: 8,
        rateModel: 9,
        vault: 10,
        claimAccount: 11,
        liquidity: 12,
        liquidityProgram: 13,
        rewardsRateModel: 14,
        tokenProgram: 15,
        associatedTokenProgram: 16,
        systemProgram: 17,
    },
    struct({
        shares: u64,
        minAmountOut: u64,
    }),
)

export interface SetRewardsRateModel {
    mint: string
}

export const setRewardsRateModel = instruction(
    {
        d8: '0xaee774cb083a8fcb',
    },
    {
        signer: 0,
        lendingAdmin: 1,
        lending: 2,
        fTokenMint: 3,
        newRewardsRateModel: 4,
        supplyTokenReservesLiquidity: 5,
    },
    struct({
        mint: address,
    }),
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
        lendingAdmin: 1,
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
        lendingAdmin: 1,
    },
    struct({
        authStatus: array(AddressBool),
    }),
)

export type UpdateRate = undefined

export const updateRate = instruction(
    {
        d8: '0x18e135bd48d4e1b2',
    },
    {
        lending: 0,
        mint: 1,
        fTokenMint: 2,
        supplyTokenReservesLiquidity: 3,
        rewardsRateModel: 4,
    },
    unit,
)

export interface UpdateRebalancer {
    newRebalancer: string
}

export const updateRebalancer = instruction(
    {
        d8: '0xcebb36e49108cb6f',
    },
    {
        signer: 0,
        lendingAdmin: 1,
    },
    struct({
        newRebalancer: address,
    }),
)

export interface Withdraw {
    amount: bigint
}

export const withdraw = instruction(
    {
        d8: '0xb712469c946da122',
    },
    {
        signer: 0,
        ownerTokenAccount: 1,
        recipientTokenAccount: 2,
        lendingAdmin: 3,
        lending: 4,
        mint: 5,
        fTokenMint: 6,
        supplyTokenReservesLiquidity: 7,
        lendingSupplyPositionOnLiquidity: 8,
        rateModel: 9,
        vault: 10,
        claimAccount: 11,
        liquidity: 12,
        liquidityProgram: 13,
        rewardsRateModel: 14,
        tokenProgram: 15,
        associatedTokenProgram: 16,
        systemProgram: 17,
    },
    struct({
        amount: u64,
    }),
)

export interface WithdrawWithMaxSharesBurn {
    amount: bigint
    maxSharesBurn: bigint
}

export const withdrawWithMaxSharesBurn = instruction(
    {
        d8: '0x2fc5b7abef12f5ab',
    },
    {
        signer: 0,
        ownerTokenAccount: 1,
        recipientTokenAccount: 2,
        lendingAdmin: 3,
        lending: 4,
        mint: 5,
        fTokenMint: 6,
        supplyTokenReservesLiquidity: 7,
        lendingSupplyPositionOnLiquidity: 8,
        rateModel: 9,
        vault: 10,
        claimAccount: 11,
        liquidity: 12,
        liquidityProgram: 13,
        rewardsRateModel: 14,
        tokenProgram: 15,
        associatedTokenProgram: 16,
        systemProgram: 17,
    },
    struct({
        amount: u64,
        maxSharesBurn: u64,
    }),
)
