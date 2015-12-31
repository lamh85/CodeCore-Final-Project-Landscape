class Location < ActiveRecord::Base
    # Validations
    validates :name, presence: {message: "This location requires a name."}

    # Relationships
    belongs_to :location_level
end