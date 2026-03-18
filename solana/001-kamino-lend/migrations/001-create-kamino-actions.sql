CREATE TABLE IF NOT EXISTS kamino_actions (
    slot UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_signature String,
    fee_payer String,
    action LowCardinality(String),
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (action, slot, tx_signature)
