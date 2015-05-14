class SettingsController < ApplicationController

  def index
    @priorities_rud = Priority.all.order(:name)
    @priority_new = Priority.new

    @categories_rud = Category.all.order(:name)
    @category_new = Category.new

  end
  
end
