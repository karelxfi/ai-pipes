CREATE TABLE IF NOT EXISTS kamino_actions (
    slot UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_signature String,
    action LowCardinality(String),
    strategy String,
    authority String,
    is_error UInt8 DEFAULT 0,
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (action, slot, tx_signature)
PARTITION BY toYYYYMM(timestamp)
