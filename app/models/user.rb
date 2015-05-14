class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  belongs_to :organization, class_name: "Organization"

  def name_display
    if first_name || last_name
      first_name.strip.squeeze(" ")
    else
      email
    end
  end
end
