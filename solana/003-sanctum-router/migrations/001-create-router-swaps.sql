CREATE TABLE IF NOT EXISTS sanctum_actions (
    slot UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_signature String,
    fee_payer String,
    program LowCardinality(String),
    lst_mint String,
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (program, slot, tx_signature, lst_mint)
