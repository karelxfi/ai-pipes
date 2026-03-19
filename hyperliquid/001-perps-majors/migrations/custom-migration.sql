CREATE TABLE IF NOT EXISTS hl_perps_fills (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    user LowCardinality(String),
    coin LowCardinality(String),
    px Float64,
    sz Float64,
    side LowCardinality(String),
    dir LowCardinality(String),
    closed_pnl Float64,
    fee Float64,
    notional Float64,
    sign Int8
) ENGINE = CollapsingMergeTree(sign)
ORDER BY (coin, block_number, user, dir)
PARTITION BY toYYYYMM(timestamp);
