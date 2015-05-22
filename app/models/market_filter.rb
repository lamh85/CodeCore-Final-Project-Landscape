class MarketFilter < ActiveRecord::Base
  belongs_to :market_search

  validates :search_term, presence: { message: "You must enter a search term"}
  validates :property, presence: { message: "You must select a property from the drop-down menu"}

  validate :contains_strings

  def contains_strings
    if search_term == "foo"
      errors.add(:search_term, "Your search terms are blank")
    end
  end

end