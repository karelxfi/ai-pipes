CREATE TABLE IF NOT EXISTS convex_staking (
  event_type LowCardinality(String),
  user FixedString(42),
  pool_id UInt32,
  block_number UInt32,
  tx_hash String,
  tx_index UInt16,
  log_index UInt16,
  timestamp DateTime CODEC (DoubleDelta, ZSTD),
  sign Int8 DEFAULT toInt8(1)
)
ENGINE = CollapsingMergeTree(sign) PARTITION BY toYYYYMM(timestamp)
ORDER BY (pool_id, timestamp, tx_index, log_index);
