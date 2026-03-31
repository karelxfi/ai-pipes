CREATE TABLE IF NOT EXISTS withdraw_fees (
    vault String,
    owner String,
    fee String,
    block_number UInt32,
    tx_hash String,
    log_index UInt32,
    timestamp DateTime64(3, 'UTC'),
    sign Int8 DEFAULT 1
) ENGINE = CollapsingMergeTree(sign)
ORDER BY (vault, block_number, log_index);
