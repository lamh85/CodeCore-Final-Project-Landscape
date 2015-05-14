class CreateReportSearches < ActiveRecord::Migration
  def change
    create_table :report_searches do |t|
      t.references :filter, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
