CREATE TABLE IF NOT EXISTS perp_positions (
    slot UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_signature String,
    action LowCardinality(String),
    owner String,
    custody String,
    side LowCardinality(String),
    size_usd_delta UInt64,
    collateral_delta UInt64,
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (action, side, slot, tx_signature)
PARTITION BY toYYYYMM(timestamp)
