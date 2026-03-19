CREATE TABLE IF NOT EXISTS aave_v2_actions (
  action LowCardinality(String),
  reserve FixedString(42),
  user FixedString(42),
  block_number UInt32,
  tx_hash String,
  log_index UInt16,
  timestamp DateTime CODEC (DoubleDelta, ZSTD),
  sign Int8 DEFAULT toInt8(1)
)
ENGINE = CollapsingMergeTree(sign) PARTITION BY toYYYYMM(timestamp)
ORDER BY (action, reserve, block_number, tx_hash, log_index);
