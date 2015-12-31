class AddReferenceToLocationLevels < ActiveRecord::Migration
  def change
    add_reference :location_levels, :country, index: true
  end
end
