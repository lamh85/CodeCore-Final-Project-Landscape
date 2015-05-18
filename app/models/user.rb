class User < ActiveRecord::Base

  belongs_to :organization, class_name: "Organization"

  has_secure_password

  def name_display
    if first_name
      first_name.strip.squeeze(" ")
    else
      email
    end
  end
end