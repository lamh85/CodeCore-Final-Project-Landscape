class AddColumnToLocationLevels < ActiveRecord::Migration
  def change
    add_column :location_levels, :thread, :integer
  end
end
