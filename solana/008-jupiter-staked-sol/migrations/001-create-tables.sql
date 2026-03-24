CREATE TABLE IF NOT EXISTS jupsol_ops (
    slot UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_signature String,
    action LowCardinality(String),
    amount_lamports UInt64,
    amount_sol Float64,
    authority String,
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (action, slot, tx_signature)
PARTITION BY toYYYYMM(timestamp)
