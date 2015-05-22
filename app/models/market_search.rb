class MarketSearch < ActiveRecord::Base
  has_many :market_filters, dependent: :destroy
  accepts_nested_attributes_for :market_filters, :allow_destroy => true

end
