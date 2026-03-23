import {event} from '../abi.support.js'
import {LogDeposit as LogDeposit_, LogRebalance as LogRebalance_, LogUpdateAuthority as LogUpdateAuthority_, LogUpdateAuths as LogUpdateAuths_, LogUpdateRates as LogUpdateRates_, LogUpdateRebalancer as LogUpdateRebalancer_, LogUpdateRewards as LogUpdateRewards_, LogWithdraw as LogWithdraw_} from './types.js'

export type LogDeposit = LogDeposit_

export const LogDeposit = event(
    {
        d8: '0xb0f301388ece016a',
    },
    LogDeposit_,
)

export type LogRebalance = LogRebalance_

export const LogRebalance = event(
    {
        d8: '0x5a43db29b5768409',
    },
    LogRebalance_,
)

export type LogUpdateAuthority = LogUpdateAuthority_

export const LogUpdateAuthority = event(
    {
        d8: '0x96989d8f0687c165',
    },
    LogUpdateAuthority_,
)

export type LogUpdateAuths = LogUpdateAuths_

export const LogUpdateAuths = event(
    {
        d8: '0x58506d306fcb4cfb',
    },
    LogUpdateAuths_,
)

export type LogUpdateRates = LogUpdateRates_

export const LogUpdateRates = event(
    {
        d8: '0xde0b713c930f44d9',
    },
    LogUpdateRates_,
)

export type LogUpdateRebalancer = LogUpdateRebalancer_

export const LogUpdateRebalancer = event(
    {
        d8: '0x424f90cc1ad999e1',
    },
    LogUpdateRebalancer_,
)

export type LogUpdateRewards = LogUpdateRewards_

export const LogUpdateRewards = event(
    {
        d8: '0x250d6fba2ff5a279',
    },
    LogUpdateRewards_,
)

export type LogWithdraw = LogWithdraw_

export const LogWithdraw = event(
    {
        d8: '0x3109b0b3debe0675',
    },
    LogWithdraw_,
)
