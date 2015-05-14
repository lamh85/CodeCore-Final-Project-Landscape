class Comparison < ActiveRecord::Base

  validates :org1, presence: {message: "You must choose an organization"}
  validates :org2, presence: {message: "You must choose an organization"}

end