class Priority < ActiveRecord::Base

  has_many :organizations

  validates :name, presence: {message: "You must enter a name for your tag"}

end
