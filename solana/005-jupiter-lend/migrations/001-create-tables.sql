CREATE TABLE IF NOT EXISTS liquidity_ops (
    slot UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_signature String,
    protocol String,
    token_reserve String,
    mint String,
    supply_amount Int128,
    borrow_amount Int128,
    op_type LowCardinality(String),
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (op_type, slot, tx_signature, mint)
PARTITION BY toYYYYMM(timestamp)
