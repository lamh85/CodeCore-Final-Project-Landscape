class LocationLevel < ActiveRecord::Base
    validates :name, presence: {message: "This level requires a name."}

end
