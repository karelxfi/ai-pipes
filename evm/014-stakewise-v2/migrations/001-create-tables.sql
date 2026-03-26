CREATE TABLE IF NOT EXISTS keeper_harvests (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    tx_index UInt32,
    log_index UInt32,
    vault String,
    rewards_root String,
    total_assets_delta String,
    unlocked_mev_delta String,
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (vault, timestamp, tx_index, log_index);

CREATE TABLE IF NOT EXISTS ostoken_mints (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    tx_index UInt32,
    log_index UInt32,
    vault String,
    receiver String,
    assets String,
    shares String,
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (vault, timestamp, tx_index, log_index);

CREATE TABLE IF NOT EXISTS ostoken_burns (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    tx_index UInt32,
    log_index UInt32,
    vault String,
    owner String,
    assets String,
    shares String,
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (vault, timestamp, tx_index, log_index);

CREATE TABLE IF NOT EXISTS mev_received (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    tx_index UInt32,
    log_index UInt32,
    assets String,
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (timestamp, tx_index, log_index);
