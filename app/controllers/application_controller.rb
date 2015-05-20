class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  # CURRENT USER
  # ############

  # Make current_user available in all views
  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end
  helper_method :current_user

  def authorize
    redirect_to "/login" unless current_user
  end

  # MY ORG'S ASSOCATIONS
  # ####################

  def my_suppliers
    if current_user && current_user.organization && current_user.organization.suppliers
      @my_suppliers = current_user.organization.suppliers.pluck(:id)
    else
      @my_suppliers = nil
    end # If current_user
  end
  helper_method :my_suppliers

  def my_clients
    if current_user && current_user.organization && current_user.organization.clients
      @my_clients = current_user.organization.clients.pluck(:id)
    else 
      @my_clients = nil
    end # If current_user
  end
  helper_method :my_clients

  def my_competitors
    if current_user && current_user.organization && (current_user.organization.competitors ||                                               current_user.organization.inverse_competitors)
      @my_competitors = current_user.organization.competitors.pluck(:id) | current_user.organization.inverse_competitors.pluck(:id)
    else
      @my_competitors = nil
    end # If current_user
  end
  helper_method :my_competitors

end
