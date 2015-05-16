class Comparison < ActiveRecord::Base

  validates :org1, presence: {message: "You must choose your first organization"}
  validates :org2, presence: {message: "You must choose your second organization"}

end