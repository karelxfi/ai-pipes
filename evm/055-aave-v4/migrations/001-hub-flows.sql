CREATE TABLE IF NOT EXISTS hub_flows (
  event_type LowCardinality(String),
  hub LowCardinality(String),
  asset_id UInt256,
  spoke LowCardinality(String),
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
