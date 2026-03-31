CREATE TABLE IF NOT EXISTS siusd_vault (
  event_type LowCardinality(String),
  sender String,
  owner String,
  receiver String,
  assets String,
  shares String,
  block_number UInt32,
  tx_hash String,
  log_index UInt16,
  timestamp DateTime CODEC(DoubleDelta, ZSTD),
  sign Int8 DEFAULT toInt8(1)
)
ENGINE = CollapsingMergeTree(sign) PARTITION BY toYYYYMM(timestamp)
ORDER BY (block_number, tx_hash, log_index);
