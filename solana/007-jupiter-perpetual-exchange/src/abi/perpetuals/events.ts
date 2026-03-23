import {event} from '../abi.support.js'
import {CreatePositionRequestEvent as CreatePositionRequestEvent_, InstantCreateTpslEvent as InstantCreateTpslEvent_, InstantUpdateTpslEvent as InstantUpdateTpslEvent_, ClosePositionRequestEvent as ClosePositionRequestEvent_, IncreasePositionEvent as IncreasePositionEvent_, IncreasePositionPreSwapEvent as IncreasePositionPreSwapEvent_, DecreasePositionEvent as DecreasePositionEvent_, DecreasePositionPostSwapEvent as DecreasePositionPostSwapEvent_, LiquidateFullPositionEvent as LiquidateFullPositionEvent_, PoolSwapEvent as PoolSwapEvent_, PoolSwapExactOutEvent as PoolSwapExactOutEvent_, AddLiquidityEvent as AddLiquidityEvent_, RemoveLiquidityEvent as RemoveLiquidityEvent_, InstantCreateLimitOrderEvent as InstantCreateLimitOrderEvent_, InstantIncreasePositionEvent as InstantIncreasePositionEvent_, InstantDecreasePositionEvent as InstantDecreasePositionEvent_, DepositCollateralEvent as DepositCollateralEvent_, WithdrawCollateralEvent as WithdrawCollateralEvent_, BorrowFromCustodyEvent as BorrowFromCustodyEvent_, RepayToCustodyEvent as RepayToCustodyEvent_, LiquidateBorrowPositionEvent as LiquidateBorrowPositionEvent_, RedeemStakeEvent as RedeemStakeEvent_, WithdrawStakeEvent as WithdrawStakeEvent_, DelegateStakeEvent as DelegateStakeEvent_, WithdrawFeesEvent as WithdrawFeesEvent_} from './types.js'

export type CreatePositionRequestEvent = CreatePositionRequestEvent_

export const CreatePositionRequestEvent = event(
    {
        d8: '0x02ee5e3569d32eba',
    },
    CreatePositionRequestEvent_,
)

export type InstantCreateTpslEvent = InstantCreateTpslEvent_

export const InstantCreateTpslEvent = event(
    {
        d8: '0xf236065f188d67c6',
    },
    InstantCreateTpslEvent_,
)

export type InstantUpdateTpslEvent = InstantUpdateTpslEvent_

export const InstantUpdateTpslEvent = event(
    {
        d8: '0xb1162f2578f61165',
    },
    InstantUpdateTpslEvent_,
)

export type ClosePositionRequestEvent = ClosePositionRequestEvent_

export const ClosePositionRequestEvent = event(
    {
        d8: '0x15225c9ee01db4f3',
    },
    ClosePositionRequestEvent_,
)

export type IncreasePositionEvent = IncreasePositionEvent_

export const IncreasePositionEvent = event(
    {
        d8: '0xf5715534d6bb9984',
    },
    IncreasePositionEvent_,
)

export type IncreasePositionPreSwapEvent = IncreasePositionPreSwapEvent_

export const IncreasePositionPreSwapEvent = event(
    {
        d8: '0xed6b098b164b04d5',
    },
    IncreasePositionPreSwapEvent_,
)

export type DecreasePositionEvent = DecreasePositionEvent_

export const DecreasePositionEvent = event(
    {
        d8: '0x409c2b4a6d83107f',
    },
    DecreasePositionEvent_,
)

export type DecreasePositionPostSwapEvent = DecreasePositionPostSwapEvent_

export const DecreasePositionPostSwapEvent = event(
    {
        d8: '0x17d210e962f55952',
    },
    DecreasePositionPostSwapEvent_,
)

export type LiquidateFullPositionEvent = LiquidateFullPositionEvent_

export const LiquidateFullPositionEvent = event(
    {
        d8: '0x806547a880485654',
    },
    LiquidateFullPositionEvent_,
)

export type PoolSwapEvent = PoolSwapEvent_

export const PoolSwapEvent = event(
    {
        d8: '0x286bd41adf8827dc',
    },
    PoolSwapEvent_,
)

export type PoolSwapExactOutEvent = PoolSwapExactOutEvent_

export const PoolSwapExactOutEvent = event(
    {
        d8: '0x79760b0bc6428e73',
    },
    PoolSwapExactOutEvent_,
)

export type AddLiquidityEvent = AddLiquidityEvent_

export const AddLiquidityEvent = event(
    {
        d8: '0x1bb299ba2fc48c2d',
    },
    AddLiquidityEvent_,
)

export type RemoveLiquidityEvent = RemoveLiquidityEvent_

export const RemoveLiquidityEvent = event(
    {
        d8: '0x8dc7b67b9f5ed766',
    },
    RemoveLiquidityEvent_,
)

export type InstantCreateLimitOrderEvent = InstantCreateLimitOrderEvent_

export const InstantCreateLimitOrderEvent = event(
    {
        d8: '0x0aa3557381e050c0',
    },
    InstantCreateLimitOrderEvent_,
)

export type InstantIncreasePositionEvent = InstantIncreasePositionEvent_

export const InstantIncreasePositionEvent = event(
    {
        d8: '0xcdec3904d16a5745',
    },
    InstantIncreasePositionEvent_,
)

export type InstantDecreasePositionEvent = InstantDecreasePositionEvent_

export const InstantDecreasePositionEvent = event(
    {
        d8: '0xabad6a19efbe3a3b',
    },
    InstantDecreasePositionEvent_,
)

export type DepositCollateralEvent = DepositCollateralEvent_

export const DepositCollateralEvent = event(
    {
        d8: '0xa90e66949b8912eb',
    },
    DepositCollateralEvent_,
)

export type WithdrawCollateralEvent = WithdrawCollateralEvent_

export const WithdrawCollateralEvent = event(
    {
        d8: '0x91262e57be95fdbf',
    },
    WithdrawCollateralEvent_,
)

export type BorrowFromCustodyEvent = BorrowFromCustodyEvent_

export const BorrowFromCustodyEvent = event(
    {
        d8: '0x17798344a8460e4c',
    },
    BorrowFromCustodyEvent_,
)

export type RepayToCustodyEvent = RepayToCustodyEvent_

export const RepayToCustodyEvent = event(
    {
        d8: '0xe83674afba18f9dd',
    },
    RepayToCustodyEvent_,
)

export type LiquidateBorrowPositionEvent = LiquidateBorrowPositionEvent_

export const LiquidateBorrowPositionEvent = event(
    {
        d8: '0x0b80fc3b31c038aa',
    },
    LiquidateBorrowPositionEvent_,
)

export type RedeemStakeEvent = RedeemStakeEvent_

export const RedeemStakeEvent = event(
    {
        d8: '0x00f1548d8baada6e',
    },
    RedeemStakeEvent_,
)

export type WithdrawStakeEvent = WithdrawStakeEvent_

export const WithdrawStakeEvent = event(
    {
        d8: '0x2f55efd6cf1d9758',
    },
    WithdrawStakeEvent_,
)

export type DelegateStakeEvent = DelegateStakeEvent_

export const DelegateStakeEvent = event(
    {
        d8: '0x55874bdea8859fd4',
    },
    DelegateStakeEvent_,
)

export type WithdrawFeesEvent = WithdrawFeesEvent_

export const WithdrawFeesEvent = event(
    {
        d8: '0xec768a5a8badb159',
    },
    WithdrawFeesEvent_,
)
