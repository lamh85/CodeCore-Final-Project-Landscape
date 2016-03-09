class Api::V1::MarketSearchesController < ApplicationController
  def new
    render json: Category.all.pluck(:name)
  end

  def results
    byebug
  end
end 
