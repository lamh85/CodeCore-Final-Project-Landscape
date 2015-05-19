class SessionsController < ApplicationController

  before_action :clear_link_pressed

  def clear_link_pressed
    session[:nav_link_pressed] = "fff"
  end  

  def new
  end

  def create
    user = User.find_by_email(params[:email])
    if user && user.authenticate(params[:password])
      session[:user_id] = user.id
      redirect_to "/"
    else
      redirect_to "/login"
      flash[:alert] = "Your email and password do not match"
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to "/login"
  end

end
