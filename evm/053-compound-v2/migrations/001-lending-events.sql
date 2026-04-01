CREATE TABLE IF NOT EXISTS lending_events (
  event_type LowCardinality(String),
  market LowCardinality(String),
  user_addr LowCardinality(String),
  payer_addr LowCardinality(String),
  amount String,
  amount_dec Float64,
  tokens String DEFAULT '',
  account_borrows String DEFAULT '',
  total_borrows String DEFAULT '',
  block_number UInt32,
  tx_hash String,
  log_index UInt16,
  timestamp DateTime64(3, 'UTC'),
  sign Int8 DEFAULT 1
) ENGINE = CollapsingMergeTree(sign)
PARTITION BY toYYYYMM(timestamp)
ORDER BY (market, event_type, block_number, log_index);
