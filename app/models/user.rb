class User < ActiveRecord::Base

  belongs_to :organization, class_name: "Organization"
  validates :email, presence: {message: "You must enter an email address."}
  validates :email, uniqueness: {message: "That email address is already taken."}

  has_secure_password

  def name_display
    if first_name
      first_name.strip.squeeze(" ")
    else
      email
    end
  end
end