class WelcomeController < ApplicationController

  before_action :clear_link_pressed

  def clear_link_pressed
    session[:nav_link_pressed] = "fff"
  end

  def index
  end

end
