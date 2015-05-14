class RenameTableReportSearchToMarketSearch < ActiveRecord::Migration
  def change
    rename_table :report_searches, :market_searches
  end
end
