CREATE TABLE IF NOT EXISTS venus_actions (
  market LowCardinality(String),
  market_name LowCardinality(String),
  action LowCardinality(String),
  user FixedString(42),
  block_number UInt32,
  tx_hash String,
  log_index UInt16,
  timestamp DateTime CODEC (DoubleDelta, ZSTD),
  sign Int8 DEFAULT toInt8(1)
)
ENGINE = CollapsingMergeTree(sign) PARTITION BY toYYYYMM(timestamp)
ORDER BY (market, action, block_number, tx_hash, log_index);
