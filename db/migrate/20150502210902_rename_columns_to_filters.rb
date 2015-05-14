class RenameColumnsToFilters < ActiveRecord::Migration
  def change
    rename_column :filters, :attribute, :property

  end
end
