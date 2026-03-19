CREATE TABLE IF NOT EXISTS keeper_harvests (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    vault String,
    rewards_root String,
    total_assets_delta String,
    unlocked_mev_delta String,
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (block_number, tx_hash, vault);

CREATE TABLE IF NOT EXISTS ostoken_mints (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    vault String,
    receiver String,
    assets String,
    shares String,
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (block_number, tx_hash, vault, receiver);

CREATE TABLE IF NOT EXISTS ostoken_burns (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    vault String,
    owner String,
    assets String,
    shares String,
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (block_number, tx_hash, vault, owner);

CREATE TABLE IF NOT EXISTS mev_received (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    tx_hash String,
    assets String,
    sign Int8 DEFAULT 1
) ENGINE = ReplacingMergeTree(sign)
ORDER BY (block_number, tx_hash);
