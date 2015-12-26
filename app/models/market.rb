class Market < ActiveRecord::Base

  default_scope { order(:sales => :desc) }

  belongs_to :organization
  belongs_to :category

  validates :product, presence: { message: "You must enter a product name."}
  validates :category_id, presence: { message: "You must select a product category."}
  validates :province, presence: { message: "You must enter a province."}
  validates :country, presence: { message: "You must enter a country."}
  validates :sales, numericality: { message: "You must enter an integer for the sales." }

  def self.seed(number)

    provinces = [
    "British Columbia",
    "Alberta",
    "Ontario",
    "Quebec"]    

    number.times {|x| 
      c = Market.new
      c.organization_id = Organization.all.sample.id
      c.product = Faker::Commerce.product_name
      c.category_id = Category.all.sample.id
      c.country = "Canada"
      c.province = provinces.sample
      c.sales = rand(10000..1000000)
      c.description = Faker::Lorem.paragraph
      c.save
    }
  end

  def self.canadaize

    provinces = [
      "British Columbia",
      "Alberta",
      "Ontario",
      "Manitoba",
      "Quebec"]

    u = Market.all
    u.each do |x|
      x.country = "Canada"
      x.province = provinces.sample
      x.description = Faker::Lorem.paragraph
      x.save
    end

  end

end # End the class