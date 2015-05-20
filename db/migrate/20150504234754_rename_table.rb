class RenameTable < ActiveRecord::Migration
  def change
    rename_table :report_filters, :market_filters
  end
end
