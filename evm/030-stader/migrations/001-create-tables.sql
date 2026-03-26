CREATE TABLE IF NOT EXISTS stader_events (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    tx_index UInt32,
    log_index UInt32,
    event_type LowCardinality(String),
    caller String DEFAULT '',
    owner String DEFAULT '',
    eth_amount String DEFAULT '0',
    ethx_shares String DEFAULT '0',
    pool_id UInt64 DEFAULT 0,
    referral_id String DEFAULT '',
    total_eth_balance String DEFAULT '0',
    total_ethx_supply String DEFAULT '0',
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (pool_id, timestamp, tx_index, log_index)
