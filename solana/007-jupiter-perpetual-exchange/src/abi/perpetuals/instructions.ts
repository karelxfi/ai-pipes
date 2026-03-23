import {struct, unit} from '@subsquid/borsh'
import {instruction} from '../abi.support.js'
import {AddCustodyParams, AddLiquidity2Params, AddPoolParams, BorrowFromCustodyParams, CloseBorrowPositionParams, CreateAndDelegateStakeAccountParams, CreateDecreasePositionMarketRequestParams, CreateDecreasePositionRequest2Params, CreateIncreasePositionMarketRequestParams, CreateTokenMetadataParams, DecreasePosition4Params, DecreasePositionWithInternalSwapParams, DecreasePositionWithTpslAndInternalSwapParams, DecreasePositionWithTpslParams, DepositParams, GetAddLiquidityAmountAndFee2Params, GetAssetsUnderManagement2Params, GetRemoveLiquidityAmountAndFee2Params, IncreasePosition4Params, IncreasePositionPreSwapParams, IncreasePositionWithInternalSwapParams, InitParams, InstantCreateLimitOrderParams, InstantCreateTpslParams, InstantDecreasePosition2Params, InstantDecreasePositionParams, InstantIncreasePositionParams, InstantIncreasePositionPreSwapParams, InstantUpdateLimitOrderParams, InstantUpdateTpslParams, LiquidateBorrowPositionParams, LiquidateFullPosition4Params, OperatorSetCustodyConfigParams, OperatorSetPoolConfigParams, PartialLiquidateBorrowPositionParams, RefreshAssetsUnderManagementParams, RemoveLiquidity2Params, RepayToCustodyParams, SetCustodyConfigParams, SetMaxGlobalSizesParams, SetPerpetualsConfigParams, SetPoolConfigParams, SetTestTimeParams, Swap2Params, SwapWithTokenLedgerParams, TestInitParams, TransferAdminParams, UpdateDecreasePositionRequest2Params, WithdrawFees2Params, WithdrawParams} from './types.js'

export interface Init {
    params: InitParams
}

export const init = instruction(
    {
        d8: '0xdc3bcfec6cfa2f64',
    },
    {
        upgradeAuthority: 0,
        admin: 1,
        transferAuthority: 2,
        perpetuals: 3,
        perpetualsProgram: 4,
        perpetualsProgramData: 5,
        systemProgram: 6,
        tokenProgram: 7,
    },
    struct({
        params: InitParams,
    }),
)

export interface AddPool {
    params: AddPoolParams
}

export const addPool = instruction(
    {
        d8: '0x73e6d4d3af3127a9',
    },
    {
        admin: 0,
        transferAuthority: 1,
        perpetuals: 2,
        pool: 3,
        lpTokenMint: 4,
        systemProgram: 5,
        tokenProgram: 6,
        rent: 7,
    },
    struct({
        params: AddPoolParams,
    }),
)

export interface AddCustody {
    params: AddCustodyParams
}

export const addCustody = instruction(
    {
        d8: '0xf7fe7e111a06d775',
    },
    {
        admin: 0,
        transferAuthority: 1,
        perpetuals: 2,
        pool: 3,
        custody: 4,
        custodyTokenAccount: 5,
        custodyTokenMint: 6,
        systemProgram: 7,
        tokenProgram: 8,
        rent: 9,
    },
    struct({
        params: AddCustodyParams,
    }),
)

export interface SetCustodyConfig {
    params: SetCustodyConfigParams
}

export const setCustodyConfig = instruction(
    {
        d8: '0x8561828fd7e524b0',
    },
    {
        admin: 0,
        perpetuals: 1,
        custody: 2,
    },
    struct({
        params: SetCustodyConfigParams,
    }),
)

export interface SetPoolConfig {
    params: SetPoolConfigParams
}

export const setPoolConfig = instruction(
    {
        d8: '0xd857417d716eb978',
    },
    {
        admin: 0,
        perpetuals: 1,
        pool: 2,
    },
    struct({
        params: SetPoolConfigParams,
    }),
)

export interface SetPerpetualsConfig {
    params: SetPerpetualsConfigParams
}

export const setPerpetualsConfig = instruction(
    {
        d8: '0x504815bf1d792d6f',
    },
    {
        admin: 0,
        perpetuals: 1,
    },
    struct({
        params: SetPerpetualsConfigParams,
    }),
)

export interface TransferAdmin {
    params: TransferAdminParams
}

export const transferAdmin = instruction(
    {
        d8: '0x2af2426ae40a6f9c',
    },
    {
        admin: 0,
        newAdmin: 1,
        perpetuals: 2,
    },
    struct({
        params: TransferAdminParams,
    }),
)

export interface WithdrawFees2 {
    params: WithdrawFees2Params
}

export const withdrawFees2 = instruction(
    {
        d8: '0xfc808f91e1dd9fcf',
    },
    {
        keeper: 0,
        transferAuthority: 1,
        perpetuals: 2,
        pool: 3,
        custody: 4,
        custodyTokenAccount: 5,
        custodyDovesPriceAccount: 6,
        custodyPythnetPriceAccount: 7,
        receivingTokenAccount: 8,
        tokenProgram: 9,
    },
    struct({
        params: WithdrawFees2Params,
    }),
)

export interface CreateTokenMetadata {
    params: CreateTokenMetadataParams
}

export const createTokenMetadata = instruction(
    {
        d8: '0xdd50b02599bca044',
    },
    {
        admin: 0,
        perpetuals: 1,
        pool: 2,
        transferAuthority: 3,
        metadata: 4,
        lpTokenMint: 5,
        tokenMetadataProgram: 6,
        systemProgram: 7,
        rent: 8,
    },
    struct({
        params: CreateTokenMetadataParams,
    }),
)

export type CreateTokenLedger = undefined

export const createTokenLedger = instruction(
    {
        d8: '0xe8f2c5fdf08f8134',
    },
    {
        tokenLedger: 0,
        payer: 1,
        systemProgram: 2,
    },
    unit,
)

export type ReallocCustody = undefined

export const reallocCustody = instruction(
    {
        d8: '0x7b3a6d8b8507e1c8',
    },
    {
        keeper: 0,
        custody: 1,
        systemProgram: 2,
        rent: 3,
    },
    unit,
)

export type ReallocPool = undefined

export const reallocPool = instruction(
    {
        d8: '0x728025a747e328b2',
    },
    {
        keeper: 0,
        pool: 1,
        systemProgram: 2,
        rent: 3,
    },
    unit,
)

export interface CreateAndDelegateStakeAccount {
    params: CreateAndDelegateStakeAccountParams
}

export const createAndDelegateStakeAccount = instruction(
    {
        d8: '0x62d17a1bde895e86',
    },
    {
        keeper: 0,
        perpetuals: 1,
        pool: 2,
        custody: 3,
        custodyTokenAccount: 4,
        transferAuthority: 5,
        stakeAccount: 6,
        stakeInfo: 7,
        validatorVoteAccount: 8,
        stakeConfig: 9,
        wsolMint: 10,
        tempWsolAccount: 11,
        rent: 12,
        clock: 13,
        stakeHistory: 14,
        stakeProgram: 15,
        systemProgram: 16,
        tokenProgram: 17,
    },
    struct({
        params: CreateAndDelegateStakeAccountParams,
    }),
)

export type Unstake = undefined

export const unstake = instruction(
    {
        d8: '0x5a5f6b2acd7c32e1',
    },
    {
        operator: 0,
        perpetuals: 1,
        pool: 2,
        custody: 3,
        transferAuthority: 4,
        stakeAccount: 5,
        stakeInfo: 6,
        clock: 7,
        stakeProgram: 8,
    },
    unit,
)

export type WithdrawStake = undefined

export const withdrawStake = instruction(
    {
        d8: '0x9908168a69b05742',
    },
    {
        keeper: 0,
        perpetuals: 1,
        pool: 2,
        custody: 3,
        custodyTokenAccount: 4,
        transferAuthority: 5,
        stakeAccount: 6,
        stakeInfo: 7,
        clock: 8,
        stakeHistory: 9,
        stakeProgram: 10,
        systemProgram: 11,
        tokenProgram: 12,
    },
    unit,
)

export type RedeemStake = undefined

export const redeemStake = instruction(
    {
        d8: '0xb2cbfa698576ff45',
    },
    {
        keeper: 0,
        perpetuals: 1,
        pool: 2,
        custody: 3,
        stakeAccount: 4,
        stakeInfo: 5,
    },
    unit,
)

export interface OperatorSetCustodyConfig {
    params: OperatorSetCustodyConfigParams
}

export const operatorSetCustodyConfig = instruction(
    {
        d8: '0xa6895ccc91e018da',
    },
    {
        operator: 0,
        custody: 1,
    },
    struct({
        params: OperatorSetCustodyConfigParams,
    }),
)

export interface OperatorSetPoolConfig {
    params: OperatorSetPoolConfigParams
}

export const operatorSetPoolConfig = instruction(
    {
        d8: '0x4cc95012c75cf669',
    },
    {
        operator: 0,
        pool: 1,
    },
    struct({
        params: OperatorSetPoolConfigParams,
    }),
)

export interface TestInit {
    params: TestInitParams
}

export const testInit = instruction(
    {
        d8: '0x30335c7a51137029',
    },
    {
        upgradeAuthority: 0,
        admin: 1,
        transferAuthority: 2,
        perpetuals: 3,
        systemProgram: 4,
        tokenProgram: 5,
    },
    struct({
        params: TestInitParams,
    }),
)

export interface SetTestTime {
    params: SetTestTimeParams
}

export const setTestTime = instruction(
    {
        d8: '0xf2e7b1fb7e919f68',
    },
    {
        admin: 0,
        perpetuals: 1,
    },
    struct({
        params: SetTestTimeParams,
    }),
)

export type SetTokenLedger = undefined

export const setTokenLedger = instruction(
    {
        d8: '0xe455b9704e4f4d02',
    },
    {
        tokenLedger: 0,
        tokenAccount: 1,
        tokenProgram: 2,
    },
    unit,
)

export interface Swap2 {
    params: Swap2Params
}

export const swap2 = instruction(
    {
        d8: '0x414b3f4ceb5b5b88',
    },
    {
        owner: 0,
        fundingAccount: 1,
        receivingAccount: 2,
        transferAuthority: 3,
        perpetuals: 4,
        pool: 5,
        receivingCustody: 6,
        receivingCustodyDovesPriceAccount: 7,
        receivingCustodyPythnetPriceAccount: 8,
        receivingCustodyTokenAccount: 9,
        dispensingCustody: 10,
        dispensingCustodyDovesPriceAccount: 11,
        dispensingCustodyPythnetPriceAccount: 12,
        dispensingCustodyTokenAccount: 13,
        tokenProgram: 14,
        eventAuthority: 15,
        program: 16,
    },
    struct({
        params: Swap2Params,
    }),
)

export interface SwapWithTokenLedger {
    params: SwapWithTokenLedgerParams
}

export const swapWithTokenLedger = instruction(
    {
        d8: '0x8b8deec529d3ac13',
    },
    {
        owner: 0,
        fundingAccount: 1,
        receivingAccount: 2,
        transferAuthority: 3,
        perpetuals: 4,
        pool: 5,
        receivingCustody: 6,
        receivingCustodyDovesPriceAccount: 7,
        receivingCustodyTokenAccount: 8,
        dispensingCustody: 9,
        dispensingCustodyDovesPriceAccount: 10,
        dispensingCustodyTokenAccount: 11,
        tokenLedger: 12,
        tokenProgram: 13,
        instruction: 14,
        eventAuthority: 15,
        program: 16,
    },
    struct({
        params: SwapWithTokenLedgerParams,
    }),
)

export interface InstantIncreasePositionPreSwap {
    params: InstantIncreasePositionPreSwapParams
}

export const instantIncreasePositionPreSwap = instruction(
    {
        d8: '0xc52656a5c71726ea',
    },
    {
        owner: 0,
        fundingAccount: 1,
        receivingAccount: 2,
        transferAuthority: 3,
        perpetuals: 4,
        pool: 5,
        receivingCustody: 6,
        receivingCustodyDovesPriceAccount: 7,
        receivingCustodyTokenAccount: 8,
        dispensingCustody: 9,
        dispensingCustodyDovesPriceAccount: 10,
        dispensingCustodyTokenAccount: 11,
        tokenProgram: 12,
        instruction: 13,
        eventAuthority: 14,
        program: 15,
    },
    struct({
        params: InstantIncreasePositionPreSwapParams,
    }),
)

export interface AddLiquidity2 {
    params: AddLiquidity2Params
}

export const addLiquidity2 = instruction(
    {
        d8: '0xe4a24e1c46db7473',
    },
    {
        owner: 0,
        fundingAccount: 1,
        lpTokenAccount: 2,
        transferAuthority: 3,
        perpetuals: 4,
        pool: 5,
        custody: 6,
        custodyDovesPriceAccount: 7,
        custodyPythnetPriceAccount: 8,
        custodyTokenAccount: 9,
        lpTokenMint: 10,
        tokenProgram: 11,
        eventAuthority: 12,
        program: 13,
    },
    struct({
        params: AddLiquidity2Params,
    }),
)

export interface RemoveLiquidity2 {
    params: RemoveLiquidity2Params
}

export const removeLiquidity2 = instruction(
    {
        d8: '0xe6d7527ff165e392',
    },
    {
        owner: 0,
        receivingAccount: 1,
        lpTokenAccount: 2,
        transferAuthority: 3,
        perpetuals: 4,
        pool: 5,
        custody: 6,
        custodyDovesPriceAccount: 7,
        custodyPythnetPriceAccount: 8,
        custodyTokenAccount: 9,
        lpTokenMint: 10,
        tokenProgram: 11,
        eventAuthority: 12,
        program: 13,
    },
    struct({
        params: RemoveLiquidity2Params,
    }),
)

export interface CreateIncreasePositionMarketRequest {
    params: CreateIncreasePositionMarketRequestParams
}

export const createIncreasePositionMarketRequest = instruction(
    {
        d8: '0xb855c71869ab9c38',
    },
    {
        owner: 0,
        fundingAccount: 1,
        perpetuals: 2,
        pool: 3,
        position: 4,
        positionRequest: 5,
        positionRequestAta: 6,
        custody: 7,
        collateralCustody: 8,
        inputMint: 9,
        referral: 10,
        tokenProgram: 11,
        associatedTokenProgram: 12,
        systemProgram: 13,
        eventAuthority: 14,
        program: 15,
    },
    struct({
        params: CreateIncreasePositionMarketRequestParams,
    }),
)

export interface CreateDecreasePositionRequest2 {
    params: CreateDecreasePositionRequest2Params
}

export const createDecreasePositionRequest2 = instruction(
    {
        d8: '0x6940c952fa0e6d4d',
    },
    {
        owner: 0,
        receivingAccount: 1,
        perpetuals: 2,
        pool: 3,
        position: 4,
        positionRequest: 5,
        positionRequestAta: 6,
        custody: 7,
        custodyDovesPriceAccount: 8,
        custodyPythnetPriceAccount: 9,
        collateralCustody: 10,
        desiredMint: 11,
        referral: 12,
        tokenProgram: 13,
        associatedTokenProgram: 14,
        systemProgram: 15,
        eventAuthority: 16,
        program: 17,
    },
    struct({
        params: CreateDecreasePositionRequest2Params,
    }),
)

export interface CreateDecreasePositionMarketRequest {
    params: CreateDecreasePositionMarketRequestParams
}

export const createDecreasePositionMarketRequest = instruction(
    {
        d8: '0x4ac6c356c163014f',
    },
    {
        owner: 0,
        receivingAccount: 1,
        perpetuals: 2,
        pool: 3,
        position: 4,
        positionRequest: 5,
        positionRequestAta: 6,
        custody: 7,
        collateralCustody: 8,
        desiredMint: 9,
        referral: 10,
        tokenProgram: 11,
        associatedTokenProgram: 12,
        systemProgram: 13,
        eventAuthority: 14,
        program: 15,
    },
    struct({
        params: CreateDecreasePositionMarketRequestParams,
    }),
)

export interface UpdateDecreasePositionRequest2 {
    params: UpdateDecreasePositionRequest2Params
}

export const updateDecreasePositionRequest2 = instruction(
    {
        d8: '0x90c8f9ff6cd9f974',
    },
    {
        owner: 0,
        perpetuals: 1,
        pool: 2,
        position: 3,
        positionRequest: 4,
        custody: 5,
        custodyDovesPriceAccount: 6,
        custodyPythnetPriceAccount: 7,
    },
    struct({
        params: UpdateDecreasePositionRequest2Params,
    }),
)

export type ClosePositionRequest2 = undefined

export const closePositionRequest2 = instruction(
    {
        d8: '0x7944a21cd82fc842',
    },
    {
        keeper: 0,
        owner: 1,
        ownerAta: 2,
        pool: 3,
        positionRequest: 4,
        positionRequestAta: 5,
        position: 6,
        mint: 7,
        tokenProgram: 8,
        systemProgram: 9,
        associatedTokenProgram: 10,
        eventAuthority: 11,
        program: 12,
    },
    unit,
)

export type ClosePositionRequest3 = undefined

export const closePositionRequest3 = instruction(
    {
        d8: '0x7a822112d32ca13a',
    },
    {
        keeper: 0,
        owner: 1,
        ownerAta: 2,
        pool: 3,
        positionRequest: 4,
        positionRequestAta: 5,
        position: 6,
        custody: 7,
        mint: 8,
        tokenProgram: 9,
        systemProgram: 10,
        associatedTokenProgram: 11,
        eventAuthority: 12,
        program: 13,
    },
    unit,
)

export interface IncreasePosition4 {
    params: IncreasePosition4Params
}

export const increasePosition4 = instruction(
    {
        d8: '0x439335172b391043',
    },
    {
        keeper: 0,
        perpetuals: 1,
        pool: 2,
        positionRequest: 3,
        positionRequestAta: 4,
        position: 5,
        custody: 6,
        custodyDovesPriceAccount: 7,
        custodyPythnetPriceAccount: 8,
        collateralCustody: 9,
        collateralCustodyDovesPriceAccount: 10,
        collateralCustodyPythnetPriceAccount: 11,
        collateralCustodyTokenAccount: 12,
        tokenProgram: 13,
        eventAuthority: 14,
        program: 15,
    },
    struct({
        params: IncreasePosition4Params,
    }),
)

export interface IncreasePositionPreSwap {
    params: IncreasePositionPreSwapParams
}

export const increasePositionPreSwap = instruction(
    {
        d8: '0x1a88e1d916155314',
    },
    {
        keeper: 0,
        keeperAta: 1,
        positionRequest: 2,
        positionRequestAta: 3,
        position: 4,
        collateralCustody: 5,
        collateralCustodyTokenAccount: 6,
        instruction: 7,
        tokenProgram: 8,
        eventAuthority: 9,
        program: 10,
    },
    struct({
        params: IncreasePositionPreSwapParams,
    }),
)

export interface IncreasePositionWithInternalSwap {
    params: IncreasePositionWithInternalSwapParams
}

export const increasePositionWithInternalSwap = instruction(
    {
        d8: '0x72376a8cc7dd2070',
    },
    {
        keeper: 0,
        perpetuals: 1,
        pool: 2,
        positionRequest: 3,
        positionRequestAta: 4,
        position: 5,
        custody: 6,
        custodyDovesPriceAccount: 7,
        custodyPythnetPriceAccount: 8,
        collateralCustody: 9,
        collateralCustodyDovesPriceAccount: 10,
        collateralCustodyPythnetPriceAccount: 11,
        collateralCustodyTokenAccount: 12,
        receivingCustody: 13,
        receivingCustodyDovesPriceAccount: 14,
        receivingCustodyPythnetPriceAccount: 15,
        receivingCustodyTokenAccount: 16,
        tokenProgram: 17,
        eventAuthority: 18,
        program: 19,
    },
    struct({
        params: IncreasePositionWithInternalSwapParams,
    }),
)

export interface DecreasePosition4 {
    params: DecreasePosition4Params
}

export const decreasePosition4 = instruction(
    {
        d8: '0xb9a172af609403aa',
    },
    {
        keeper: 0,
        owner: 1,
        transferAuthority: 2,
        perpetuals: 3,
        pool: 4,
        positionRequest: 5,
        positionRequestAta: 6,
        position: 7,
        custody: 8,
        custodyDovesPriceAccount: 9,
        custodyPythnetPriceAccount: 10,
        collateralCustody: 11,
        collateralCustodyDovesPriceAccount: 12,
        collateralCustodyPythnetPriceAccount: 13,
        collateralCustodyTokenAccount: 14,
        tokenProgram: 15,
        eventAuthority: 16,
        program: 17,
    },
    struct({
        params: DecreasePosition4Params,
    }),
)

export interface DecreasePositionWithInternalSwap {
    params: DecreasePositionWithInternalSwapParams
}

export const decreasePositionWithInternalSwap = instruction(
    {
        d8: '0x8311996e77646126',
    },
    {
        keeper: 0,
        owner: 1,
        transferAuthority: 2,
        perpetuals: 3,
        pool: 4,
        positionRequest: 5,
        positionRequestAta: 6,
        position: 7,
        custody: 8,
        custodyDovesPriceAccount: 9,
        custodyPythnetPriceAccount: 10,
        collateralCustody: 11,
        collateralCustodyDovesPriceAccount: 12,
        collateralCustodyPythnetPriceAccount: 13,
        collateralCustodyTokenAccount: 14,
        dispensingCustody: 15,
        dispensingCustodyDovesPriceAccount: 16,
        dispensingCustodyPythnetPriceAccount: 17,
        dispensingCustodyTokenAccount: 18,
        tokenProgram: 19,
        eventAuthority: 20,
        program: 21,
    },
    struct({
        params: DecreasePositionWithInternalSwapParams,
    }),
)

export interface DecreasePositionWithTpsl {
    params: DecreasePositionWithTpslParams
}

export const decreasePositionWithTpsl = instruction(
    {
        d8: '0x6c12cbd1e36741a5',
    },
    {
        keeper: 0,
        owner: 1,
        transferAuthority: 2,
        perpetuals: 3,
        pool: 4,
        positionRequest: 5,
        positionRequestAta: 6,
        position: 7,
        custody: 8,
        custodyDovesPriceAccount: 9,
        collateralCustody: 10,
        collateralCustodyDovesPriceAccount: 11,
        collateralCustodyTokenAccount: 12,
        tokenProgram: 13,
        eventAuthority: 14,
        program: 15,
    },
    struct({
        params: DecreasePositionWithTpslParams,
    }),
)

export interface DecreasePositionWithTpslAndInternalSwap {
    params: DecreasePositionWithTpslAndInternalSwapParams
}

export const decreasePositionWithTpslAndInternalSwap = instruction(
    {
        d8: '0x026fc8e723417beb',
    },
    {
        keeper: 0,
        owner: 1,
        transferAuthority: 2,
        perpetuals: 3,
        pool: 4,
        positionRequest: 5,
        positionRequestAta: 6,
        position: 7,
        custody: 8,
        custodyDovesPriceAccount: 9,
        collateralCustody: 10,
        collateralCustodyDovesPriceAccount: 11,
        collateralCustodyTokenAccount: 12,
        dispensingCustody: 13,
        dispensingCustodyDovesPriceAccount: 14,
        dispensingCustodyTokenAccount: 15,
        tokenProgram: 16,
        eventAuthority: 17,
        program: 18,
    },
    struct({
        params: DecreasePositionWithTpslAndInternalSwapParams,
    }),
)

export interface LiquidateFullPosition4 {
    params: LiquidateFullPosition4Params
}

export const liquidateFullPosition4 = instruction(
    {
        d8: '0x40b05833a8bc9caf',
    },
    {
        signer: 0,
        perpetuals: 1,
        pool: 2,
        position: 3,
        custody: 4,
        custodyDovesPriceAccount: 5,
        custodyPythnetPriceAccount: 6,
        collateralCustody: 7,
        collateralCustodyDovesPriceAccount: 8,
        collateralCustodyPythnetPriceAccount: 9,
        collateralCustodyTokenAccount: 10,
        eventAuthority: 11,
        program: 12,
    },
    struct({
        params: LiquidateFullPosition4Params,
    }),
)

export interface RefreshAssetsUnderManagement {
    params: RefreshAssetsUnderManagementParams
}

export const refreshAssetsUnderManagement = instruction(
    {
        d8: '0xa200d737e10fb900',
    },
    {
        keeper: 0,
        perpetuals: 1,
        pool: 2,
        lpTokenMint: 3,
    },
    struct({
        params: RefreshAssetsUnderManagementParams,
    }),
)

export interface SetMaxGlobalSizes {
    params: SetMaxGlobalSizesParams
}

export const setMaxGlobalSizes = instruction(
    {
        d8: '0x5902d218a7e30dd6',
    },
    {
        keeper: 0,
        custody: 1,
        pool: 2,
    },
    struct({
        params: SetMaxGlobalSizesParams,
    }),
)

export interface InstantCreateTpsl {
    params: InstantCreateTpslParams
}

export const instantCreateTpsl = instruction(
    {
        d8: '0x7562427f1e3249b9',
    },
    {
        keeper: 0,
        apiKeeper: 1,
        owner: 2,
        receivingAccount: 3,
        perpetuals: 4,
        pool: 5,
        position: 6,
        positionRequest: 7,
        positionRequestAta: 8,
        custody: 9,
        custodyDovesPriceAccount: 10,
        custodyPythnetPriceAccount: 11,
        collateralCustody: 12,
        desiredMint: 13,
        referral: 14,
        tokenProgram: 15,
        associatedTokenProgram: 16,
        systemProgram: 17,
        eventAuthority: 18,
        program: 19,
    },
    struct({
        params: InstantCreateTpslParams,
    }),
)

export interface InstantCreateLimitOrder {
    params: InstantCreateLimitOrderParams
}

export const instantCreateLimitOrder = instruction(
    {
        d8: '0xc225c37b287f7e9c',
    },
    {
        keeper: 0,
        apiKeeper: 1,
        owner: 2,
        fundingAccount: 3,
        perpetuals: 4,
        pool: 5,
        position: 6,
        positionRequest: 7,
        positionRequestAta: 8,
        custody: 9,
        custodyDovesPriceAccount: 10,
        custodyPythnetPriceAccount: 11,
        collateralCustody: 12,
        inputMint: 13,
        referral: 14,
        tokenProgram: 15,
        associatedTokenProgram: 16,
        systemProgram: 17,
        eventAuthority: 18,
        program: 19,
    },
    struct({
        params: InstantCreateLimitOrderParams,
    }),
)

export interface InstantIncreasePosition {
    params: InstantIncreasePositionParams
}

export const instantIncreasePosition = instruction(
    {
        d8: '0xa47e44b6dfa640b7',
    },
    {
        keeper: 0,
        apiKeeper: 1,
        owner: 2,
        fundingAccount: 3,
        perpetuals: 4,
        pool: 5,
        position: 6,
        custody: 7,
        custodyDovesPriceAccount: 8,
        custodyPythnetPriceAccount: 9,
        collateralCustody: 10,
        collateralCustodyDovesPriceAccount: 11,
        collateralCustodyPythnetPriceAccount: 12,
        collateralCustodyTokenAccount: 13,
        tokenLedger: 14,
        referral: 15,
        tokenProgram: 16,
        systemProgram: 17,
        eventAuthority: 18,
        program: 19,
    },
    struct({
        params: InstantIncreasePositionParams,
    }),
)

export interface InstantDecreasePosition {
    params: InstantDecreasePositionParams
}

export const instantDecreasePosition = instruction(
    {
        d8: '0x2e17f02c1e8a5e8c',
    },
    {
        keeper: 0,
        apiKeeper: 1,
        owner: 2,
        receivingAccount: 3,
        transferAuthority: 4,
        perpetuals: 5,
        pool: 6,
        position: 7,
        custody: 8,
        custodyDovesPriceAccount: 9,
        custodyPythnetPriceAccount: 10,
        collateralCustody: 11,
        collateralCustodyDovesPriceAccount: 12,
        collateralCustodyPythnetPriceAccount: 13,
        collateralCustodyTokenAccount: 14,
        desiredMint: 15,
        referral: 16,
        tokenProgram: 17,
        associatedTokenProgram: 18,
        systemProgram: 19,
        eventAuthority: 20,
        program: 21,
    },
    struct({
        params: InstantDecreasePositionParams,
    }),
)

export interface InstantDecreasePosition2 {
    params: InstantDecreasePosition2Params
}

export const instantDecreasePosition2 = instruction(
    {
        d8: '0xa2bfc83e8b3eb011',
    },
    {
        keeper: 0,
        apiKeeper: 1,
        owner: 2,
        receivingAccount: 3,
        transferAuthority: 4,
        perpetuals: 5,
        pool: 6,
        position: 7,
        custody: 8,
        custodyDovesPriceAccount: 9,
        collateralCustody: 10,
        collateralCustodyDovesPriceAccount: 11,
        collateralCustodyTokenAccount: 12,
        desiredMint: 13,
        referral: 14,
        positionRequest: 15,
        positionRequestAta: 16,
        tokenProgram: 17,
        associatedTokenProgram: 18,
        systemProgram: 19,
        eventAuthority: 20,
        program: 21,
    },
    struct({
        params: InstantDecreasePosition2Params,
    }),
)

export interface InstantUpdateLimitOrder {
    params: InstantUpdateLimitOrderParams
}

export const instantUpdateLimitOrder = instruction(
    {
        d8: '0x88f5e53a798d0ccf',
    },
    {
        keeper: 0,
        apiKeeper: 1,
        owner: 2,
        perpetuals: 3,
        pool: 4,
        position: 5,
        positionRequest: 6,
        custody: 7,
        custodyDovesPriceAccount: 8,
        custodyPythnetPriceAccount: 9,
    },
    struct({
        params: InstantUpdateLimitOrderParams,
    }),
)

export interface InstantUpdateTpsl {
    params: InstantUpdateTpslParams
}

export const instantUpdateTpsl = instruction(
    {
        d8: '0x90e47225a5f26f65',
    },
    {
        keeper: 0,
        apiKeeper: 1,
        owner: 2,
        perpetuals: 3,
        pool: 4,
        position: 5,
        positionRequest: 6,
        custody: 7,
        custodyDovesPriceAccount: 8,
        custodyPythnetPriceAccount: 9,
        eventAuthority: 10,
        program: 11,
    },
    struct({
        params: InstantUpdateTpslParams,
    }),
)

export interface GetAddLiquidityAmountAndFee2 {
    params: GetAddLiquidityAmountAndFee2Params
}

export const getAddLiquidityAmountAndFee2 = instruction(
    {
        d8: '0x6d9d37a908510476',
    },
    {
        perpetuals: 0,
        pool: 1,
        custody: 2,
        custodyDovesPriceAccount: 3,
        custodyPythnetPriceAccount: 4,
        lpTokenMint: 5,
    },
    struct({
        params: GetAddLiquidityAmountAndFee2Params,
    }),
)

export interface GetRemoveLiquidityAmountAndFee2 {
    params: GetRemoveLiquidityAmountAndFee2Params
}

export const getRemoveLiquidityAmountAndFee2 = instruction(
    {
        d8: '0xb73b486edff3968e',
    },
    {
        perpetuals: 0,
        pool: 1,
        custody: 2,
        custodyDovesPriceAccount: 3,
        custodyPythnetPriceAccount: 4,
        lpTokenMint: 5,
    },
    struct({
        params: GetRemoveLiquidityAmountAndFee2Params,
    }),
)

export interface GetAssetsUnderManagement2 {
    params: GetAssetsUnderManagement2Params
}

export const getAssetsUnderManagement2 = instruction(
    {
        d8: '0xc1d20df971951d54',
    },
    {
        perpetuals: 0,
        pool: 1,
    },
    struct({
        params: GetAssetsUnderManagement2Params,
    }),
)

export interface BorrowFromCustody {
    params: BorrowFromCustodyParams
}

export const borrowFromCustody = instruction(
    {
        d8: '0x99b741417121f92d',
    },
    {
        owner: 0,
        perpetuals: 1,
        pool: 2,
        custody: 3,
        transferAuthority: 4,
        borrowPosition: 5,
        custodyTokenAccount: 6,
        userTokenAccount: 7,
        lpTokenMint: 8,
        tokenProgram: 9,
        eventAuthority: 10,
        program: 11,
    },
    struct({
        params: BorrowFromCustodyParams,
    }),
)

export interface RepayToCustody {
    params: RepayToCustodyParams
}

export const repayToCustody = instruction(
    {
        d8: '0xd3dbb7def84a051a',
    },
    {
        owner: 0,
        perpetuals: 1,
        pool: 2,
        custody: 3,
        borrowPosition: 4,
        custodyTokenAccount: 5,
        userTokenAccount: 6,
        tokenProgram: 7,
        eventAuthority: 8,
        program: 9,
    },
    struct({
        params: RepayToCustodyParams,
    }),
)

export interface DepositCollateralForBorrows {
    params: DepositParams
}

export const depositCollateralForBorrows = instruction(
    {
        d8: '0x1102c3be4c10ee4a',
    },
    {
        owner: 0,
        perpetuals: 1,
        pool: 2,
        custody: 3,
        transferAuthority: 4,
        borrowPosition: 5,
        collateralTokenAccount: 6,
        userTokenAccount: 7,
        lpTokenMint: 8,
        tokenProgram: 9,
        systemProgram: 10,
        eventAuthority: 11,
        program: 12,
    },
    struct({
        params: DepositParams,
    }),
)

export interface WithdrawCollateralForBorrows {
    params: WithdrawParams
}

export const withdrawCollateralForBorrows = instruction(
    {
        d8: '0x75a03c52ede92eb6',
    },
    {
        owner: 0,
        perpetuals: 1,
        pool: 2,
        custody: 3,
        transferAuthority: 4,
        borrowPosition: 5,
        collateralTokenAccount: 6,
        userTokenAccount: 7,
        lpTokenMint: 8,
        tokenProgram: 9,
        eventAuthority: 10,
        program: 11,
    },
    struct({
        params: WithdrawParams,
    }),
)

export interface LiquidateBorrowPosition {
    params: LiquidateBorrowPositionParams
}

export const liquidateBorrowPosition = instruction(
    {
        d8: '0xebc91185ea4854d2',
    },
    {
        signer: 0,
        perpetuals: 1,
        pool: 2,
        custody: 3,
        transferAuthority: 4,
        borrowPosition: 5,
        collateralTokenAccount: 6,
        lpTokenMint: 7,
        tokenProgram: 8,
        eventAuthority: 9,
        program: 10,
    },
    struct({
        params: LiquidateBorrowPositionParams,
    }),
)

export interface PartialLiquidateBorrowPosition {
    params: PartialLiquidateBorrowPositionParams
}

export const partialLiquidateBorrowPosition = instruction(
    {
        d8: '0xfaa60d4a61cc82d1',
    },
    {
        signer: 0,
        perpetuals: 1,
        pool: 2,
        custody: 3,
        transferAuthority: 4,
        borrowPosition: 5,
        collateralTokenAccount: 6,
        lpTokenMint: 7,
        tokenProgram: 8,
        eventAuthority: 9,
        program: 10,
    },
    struct({
        params: PartialLiquidateBorrowPositionParams,
    }),
)

export interface CloseBorrowPosition {
    params: CloseBorrowPositionParams
}

export const closeBorrowPosition = instruction(
    {
        d8: '0xcce291cde825038c',
    },
    {
        owner: 0,
        borrowPosition: 1,
        systemProgram: 2,
        eventAuthority: 3,
        program: 4,
    },
    struct({
        params: CloseBorrowPositionParams,
    }),
)
