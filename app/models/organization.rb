class Organization < ActiveRecord::Base

  default_scope { order(:name => :asc) }

  # ASSOCIATE WITH PRODUCTS

  has_many :products

  # ASSOCIATE WITH COMPETITION

  # Rails can find a table named Competition
  has_many :competitions, dependent: :destroy
  # Use the above to find "competitors"
  has_many :competitors, through: :competitions
  # An org from the Org table can be in the "competitor_id" column
  has_many :inverse_competitions, class_name: "Competition", foreign_key: "competitor_id"
  has_many :inverse_competitors, through: :inverse_competitions, source: :organization

  # ASSOCIATE WITH CHANNEL

  has_many :channels, dependent: :destroy
  has_many :clients, through: :channels
  # Create an association that goes FROM Channel to Org
  has_many :supplier_assoications, class_name: "Channel", foreign_key: "client_id"
  # Use the above association to extract Org info
  has_many :suppliers, through: :supplier_assoications, source: :organization

  # ASSOCIATE WITH PRIORITY LEVEL
  belongs_to :priority, class_name: "Priority"

  # ASSOCIATE WITH USER
  has_many :users, foreign_key: "orgainzation_id"

  # ASSOCIATE WITH MARKET
  has_many :markets, dependent: :destroy
  accepts_nested_attributes_for :markets, :allow_destroy => true

  # VALIDATIONS

  validates :name, uniqueness: { message: "There is already an organization with this name" }
  validates :name, presence: { message: "Please enter the organization's name"}
  validates :revenue, numericality: { message: "You must enter an integer for the revenue" }
  validates :revenue, presence: {message: "You must enter revenue"}
  validates :priority_id, presence: { message: "You must enter a priority level for this organization"}

  attr_accessor :home_org

  # SEARCH FUNCTIONS AND PRESENTATION

  def self.provinces
    return provinces = [
    "British Columbia",
    "Alberta",
    "Ontario",
    "Quebec"]
  end

  def self.seed(number)
    provinces = [
    "British Columbia",
    "Alberta",
    "Ontario",
    "Quebec"]

    number.times do |x|
      org = Organization.new
      org.name = Faker::Company.name
      org.revenue = rand(1000..1000000)
      org.description = Faker::Lorem.paragraph(1)
      org.street = Faker::Address.street_address
      org.city = Faker::Address.city
      org.province = provinces.sample
      org.country = "Canada"
      org.priority_id = Priority.all.sample.id
      org.save
    end
  end

      # org.city = Faker::Address.city
      # org.province = provinces.sample
      # org.country = "Canada"

  def self.canadaize

    provinces = [
    "British Columbia",
    "Alberta",
    "Ontario",
    "Manitoba",
    "Quebec"]    

    u = Organization.all
    u.each do |org|
      org.country = "Canada"
      org.province = provinces.sample
      org.city = Faker::Address.city
      org.street = Faker::Address.street_address
      org.description = Faker::Lorem.paragraph(1)
      org.save
    end
  end

  def self.rename
    Organization.all.each do |x|
      x.name = Faker::Company.name
      x.save
    end
  end

  def self.sort_by_name
    reorder("name asc")
  end

  # OTHER

end
