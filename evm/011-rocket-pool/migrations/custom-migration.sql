CREATE TABLE IF NOT EXISTS reth_flows (
  event_type LowCardinality(String),
  user FixedString(42),
  reth_amount UInt256,
  eth_amount UInt256,
  block_number UInt32,
  tx_hash String,
  log_index UInt16,
  timestamp DateTime CODEC (DoubleDelta, ZSTD),
  sign Int8 DEFAULT toInt8(1)
)
ENGINE = CollapsingMergeTree(sign) PARTITION BY toYYYYMM(timestamp)
ORDER BY (event_type, block_number, tx_hash, log_index);
