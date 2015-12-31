class RemoveColumnsFromLocations < ActiveRecord::Migration
  def change
    remove_column :locations, :type, :string
    remove_column :locations, :parent_id, :string
  end
end
