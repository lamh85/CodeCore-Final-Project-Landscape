class AddReferenceToLocations < ActiveRecord::Migration
  def change
    add_reference :locations, :location_level, index: true
  end
end
