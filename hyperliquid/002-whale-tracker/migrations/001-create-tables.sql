CREATE TABLE IF NOT EXISTS hl_whale_fills (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    user String,
    coin String,
    px Float64,
    sz Float64,
    side String,
    dir String,
    closed_pnl Float64,
    fee Float64,
    notional Float64,
    start_position Float64,
    sign Int8
) ENGINE = CollapsingMergeTree(sign)
ORDER BY (coin, user, block_number)
