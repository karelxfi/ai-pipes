CREATE TABLE IF NOT EXISTS moolah_events (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    tx_index UInt32,
    log_index UInt32,
    event_type LowCardinality(String),
    market_id String,
    caller String,
    on_behalf String,
    receiver String,
    assets String,
    shares String,
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (market_id, timestamp, tx_index, log_index);

CREATE TABLE IF NOT EXISTS moolah_interest (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    tx_index UInt32,
    log_index UInt32,
    market_id String,
    prev_borrow_rate String,
    interest String,
    fee_shares String,
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (market_id, timestamp, tx_index, log_index);

CREATE TABLE IF NOT EXISTS moolah_flash_loans (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    tx_index UInt32,
    log_index UInt32,
    caller String,
    token String,
    assets String,
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (timestamp, tx_index, log_index);
