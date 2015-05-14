class AddColumnToFilters < ActiveRecord::Migration
  def change
    add_reference :filters, :search, index: true, foreign_key: true
  end
end
