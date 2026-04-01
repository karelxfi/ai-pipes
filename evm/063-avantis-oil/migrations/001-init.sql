CREATE TABLE IF NOT EXISTS commodity_orders (
    trader String,
    pair_index UInt32,
    commodity String,
    order_type String,
    is_open UInt8,
    order_id UInt64,
    is_buy UInt8,
    is_pnl UInt8,
    initial_pos_token String,
    leverage UInt64,
    block_number UInt32,
    tx_hash String,
    log_index UInt32,
    timestamp DateTime64(3, 'UTC')
) ENGINE = ReplacingMergeTree()
ORDER BY (block_number, log_index);

CREATE TABLE IF NOT EXISTS commodity_limits (
    trader String,
    pair_index UInt32,
    commodity String,
    trade_index UInt32,
    is_buy UInt8,
    open_price String,
    order_type UInt8,
    collateral String,
    leverage UInt64,
    block_number UInt32,
    tx_hash String,
    log_index UInt32,
    timestamp DateTime64(3, 'UTC')
) ENGINE = ReplacingMergeTree()
ORDER BY (block_number, log_index);

CREATE TABLE IF NOT EXISTS commodity_risk_updates (
    trader String,
    pair_index UInt32,
    commodity String,
    update_kind String,
    trade_index UInt32,
    new_value String,
    block_number UInt32,
    tx_hash String,
    log_index UInt32,
    timestamp DateTime64(3, 'UTC')
) ENGINE = ReplacingMergeTree()
ORDER BY (block_number, log_index);
