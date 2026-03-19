CREATE TABLE IF NOT EXISTS moolah_events (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    event_type LowCardinality(String),
    market_id String,
    caller String,
    on_behalf String,
    receiver String,
    assets String,
    shares String,
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (event_type, block_number, tx_hash, market_id);

CREATE TABLE IF NOT EXISTS moolah_interest (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    market_id String,
    prev_borrow_rate String,
    interest String,
    fee_shares String,
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (block_number, tx_hash, market_id);

CREATE TABLE IF NOT EXISTS moolah_flash_loans (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    caller String,
    token String,
    assets String,
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (block_number, tx_hash, caller);
