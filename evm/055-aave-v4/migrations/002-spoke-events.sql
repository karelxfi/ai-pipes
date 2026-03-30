CREATE TABLE IF NOT EXISTS spoke_events (
  event_type LowCardinality(String),
  spoke LowCardinality(String),
  reserve_id UInt256,
  caller String,
  user String,
  shares UInt256,
  amount UInt256,
  block_number UInt32,
  tx_hash String,
  log_index UInt16,
  timestamp DateTime CODEC(DoubleDelta, ZSTD),
  sign Int8 DEFAULT toInt8(1)
)
ENGINE = CollapsingMergeTree(sign) PARTITION BY toYYYYMM(timestamp)
ORDER BY (block_number, tx_hash, log_index);
