class LocationLevel < ActiveRecord::Base
    # Validations
    validates :name, presence: {message: "This level requires a name."}

    # Relationships
    has_many :locations

    def parent_level
        level_value = self.level - 1
        while level_value >= 1
            results = LocationLevel.where('level = ?', level_value).where('thread = ?', self.thread)
            return results if results.length > 0
            level_value -= 1 if results.length > 0
        end
    end
end