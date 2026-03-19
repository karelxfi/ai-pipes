CREATE TABLE IF NOT EXISTS convex_staking (
  event_type LowCardinality(String),
  user FixedString(42),
  pool_id UInt32,
  block_number UInt32,
  tx_hash String,
  log_index UInt16,
  timestamp DateTime CODEC (DoubleDelta, ZSTD),
  sign Int8 DEFAULT toInt8(1)
)
ENGINE = CollapsingMergeTree(sign) PARTITION BY toYYYYMM(timestamp)
ORDER BY (event_type, pool_id, block_number, tx_hash, log_index);
