class MarketFilter < ActiveRecord::Base
  belongs_to :market_search

  validates :search_term, presence: { message: "You must enter a search term"}
  validates :property, presence: { message: "You must select a property from the drop-down menu"}
end