CREATE TABLE IF NOT EXISTS lista_cdp_events (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    tx_index UInt32,
    log_index UInt32,
    event_type LowCardinality(String),
    user_address String,
    collateral String DEFAULT '',
    amount String DEFAULT '0',
    total_or_debt String DEFAULT '0',
    liquidation_price String DEFAULT '0',
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (timestamp, tx_index, log_index)
