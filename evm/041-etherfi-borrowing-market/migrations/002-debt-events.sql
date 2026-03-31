CREATE TABLE IF NOT EXISTS debt_events (
  event_type LowCardinality(String),
  user_safe String,
  token String,
  amount UInt256,
  amount_usd UInt256,
  block_number UInt32,
  tx_hash String,
  log_index UInt16,
  timestamp DateTime CODEC(DoubleDelta, ZSTD),
  sign Int8 DEFAULT toInt8(1)
)
ENGINE = CollapsingMergeTree(sign) PARTITION BY toYYYYMM(timestamp)
ORDER BY (block_number, tx_hash, log_index);
