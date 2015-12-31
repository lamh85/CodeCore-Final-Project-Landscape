class RenameColumnInLocationLevels < ActiveRecord::Migration
  def change
    rename_column :location_levels, :parent, :level
  end
end
