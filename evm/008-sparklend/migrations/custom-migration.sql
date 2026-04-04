CREATE TABLE IF NOT EXISTS sparklend_actions (
  action LowCardinality(String),
  reserve FixedString(42),
  user FixedString(42),
  amount UInt256,
  block_number UInt32,
  tx_hash String,
  tx_index UInt16,
  log_index UInt16,
  timestamp DateTime CODEC (DoubleDelta, ZSTD),
  sign Int8 DEFAULT toInt8(1)
)
ENGINE = CollapsingMergeTree(sign) PARTITION BY toYYYYMM(timestamp)
ORDER BY (reserve, timestamp, tx_index, log_index);
