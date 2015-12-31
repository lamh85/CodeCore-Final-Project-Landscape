class Location < ActiveRecord::Base
    # Validations

    # Relationships
    belongs_to :location_level
end