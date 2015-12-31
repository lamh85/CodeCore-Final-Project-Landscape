class LocationLevel < ActiveRecord::Base
    # Validations
    validates :name, presence: {message: "This level requires a name."}

    # Relationships
    has_many :locations
end
