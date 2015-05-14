class CreateReportFilters < ActiveRecord::Migration
  def change
    create_table :report_filters do |t|
      t.string :property
      t.string :search_term

      t.timestamps null: false
    end
  end
end
