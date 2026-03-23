CREATE TABLE IF NOT EXISTS fills (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    user String,
    coin LowCardinality(String),
    asset_class LowCardinality(String),
    sub_class LowCardinality(String),
    px Float64,
    sz Float64,
    side LowCardinality(String),
    dir LowCardinality(String),
    closed_pnl Float64,
    fee Float64,
    notional Float64,
    sign Int8
) ENGINE = CollapsingMergeTree(sign)
ORDER BY (asset_class, coin, block_number)
PARTITION BY toYYYYMM(timestamp);
