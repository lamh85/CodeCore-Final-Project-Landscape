class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  helper ApplicationHelper

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

  # COMMON SEARCH METHODS
  # #####################

  # Deleting blanks and trimming white spaces
  def sanitize_array(search_term)
    search_terms_array = search_term.split(",")
    search_terms_array.each do |element| # for every comma-separated search term
      element.strip! # trim whitespaces
    end
    search_terms_array.delete("") # Delete blank elements
    search_terms_array.each do |element| element.replace("%#{element}%") end
    return search_terms_array
  end

end
