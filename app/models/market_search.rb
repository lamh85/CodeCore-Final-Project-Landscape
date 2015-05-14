class MarketSearch < ActiveRecord::Base
  has_many :market_filters, dependent: :destroy
  accepts_nested_attributes_for :market_filters, :allow_destroy => true
  # , reject_if: lambda {|x|
  #               x[:property].blank? &&
  #               x[:search_term].blank?}

end
