class RenameTable < ActiveRecord::Migration
  def change
    rename_table :report_filter, :market_filter
  end
end
