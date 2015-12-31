class RemoveReferenceFromLocationLevels < ActiveRecord::Migration
  def change
    remove_reference :location_levels, :country, index: true
  end
end
