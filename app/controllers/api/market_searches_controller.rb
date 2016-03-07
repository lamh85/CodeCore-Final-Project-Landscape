class Api::MarketSearchesController < ApplicationController::API

  def new
    render json: Category.all.pluck(:name)
  end

  def results
    byebug
  end
end