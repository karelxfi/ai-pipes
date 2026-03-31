CREATE TABLE IF NOT EXISTS strategy_ops (
    vault String,
    op_type String,
    amount String,
    protocol_from UInt8 DEFAULT 0,
    protocol_to UInt8 DEFAULT 0,
    block_number UInt32,
    tx_hash String,
    log_index UInt32,
    timestamp DateTime64(3, 'UTC'),
    sign Int8 DEFAULT 1
) ENGINE = CollapsingMergeTree(sign)
ORDER BY (vault, op_type, block_number, log_index);
