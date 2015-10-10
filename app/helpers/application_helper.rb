module ApplicationHelper

  # MY ORG'S ASSOCATIONS
  # ####################

  def my_suppliers
    if current_user && current_user.organization && current_user.organization.suppliers
      @my_suppliers = current_user.organization.suppliers.pluck(:id)
    else
      @my_suppliers = nil
    end # If current_user
  end

  def my_clients
    if current_user && current_user.organization && current_user.organization.clients
      @my_clients = current_user.organization.clients.pluck(:id)
    else 
      @my_clients = nil
    end # If current_user
  end

  def my_competitors
    if current_user && current_user.organization && (current_user.organization.competitors || current_user.organization.inverse_competitors)
      @my_competitors = current_user.organization.competitors.pluck(:id) | current_user.organization.inverse_competitors.pluck(:id)
    else
      @my_competitors = nil
    end # If current_user
  end

  # OTHER
  # #####

  def nav_link(path, display_text)
    link_to(path) do
      "<div class=\"wrapper-link\">#{display_text}</div>".html_safe
    end
  end

  def mobile_message
    return "DEAR mobile users: If this table is cut off, try scrolling horizontally."
  end

  def greeting
    greeting_question = ["How are you today?","What is your focus today?","Have you had your caffeine today?"]
    return "Hello #{current_user.name_display}. #{greeting_question.sample}"
  end

end
