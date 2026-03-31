CREATE TABLE IF NOT EXISTS psm_ops (
  event_type LowCardinality(String),
  psm_label LowCardinality(String),
  from_addr LowCardinality(String),
  to_addr LowCardinality(String),
  signer LowCardinality(String),
  amount String,
  amount_usd Float64,
  event_timestamp UInt64,
  block_number UInt32,
  tx_hash String,
  log_index UInt16,
  timestamp DateTime64(3, 'UTC'),
  sign Int8 DEFAULT 1
) ENGINE = CollapsingMergeTree(sign)
PARTITION BY toYYYYMM(timestamp)
ORDER BY (psm_label, event_type, block_number, log_index);
