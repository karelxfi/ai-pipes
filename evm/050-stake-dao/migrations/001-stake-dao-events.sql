CREATE TABLE IF NOT EXISTS stake_dao_events (
  event_type LowCardinality(String),
  token LowCardinality(String),
  from_addr LowCardinality(String),
  to_addr LowCardinality(String),
  provider LowCardinality(String),
  amount String,
  amount_dec Float64,
  locktime UInt64 DEFAULT 0,
  lock_type Int16 DEFAULT 0,
  prev_supply String DEFAULT '',
  new_supply String DEFAULT '',
  block_number UInt32,
  tx_hash String,
  log_index UInt16,
  timestamp DateTime64(3, 'UTC'),
  sign Int8 DEFAULT 1
) ENGINE = CollapsingMergeTree(sign)
PARTITION BY toYYYYMM(timestamp)
ORDER BY (token, event_type, block_number, log_index);
