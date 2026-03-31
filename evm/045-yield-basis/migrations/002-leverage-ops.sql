CREATE TABLE IF NOT EXISTS leverage_ops (
    vault String,
    op_type String,
    sender String,
    amount String,
    secondary_amount String,
    discount String,
    block_number UInt32,
    tx_hash String,
    log_index UInt16,
    timestamp DateTime64(3, 'UTC')
) ENGINE = ReplacingMergeTree()
ORDER BY (vault, block_number, log_index);
