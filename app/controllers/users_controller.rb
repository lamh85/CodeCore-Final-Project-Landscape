class UsersController < ApplicationController

  def update
    # render text: params
    if current_user.update(user_params)
      if params[:change_org]
        flash[:notice] = "You have successfully changed your home organization."
      else
        flash[:notice] = "You have successfully updated your profile"
      end
      redirect_to "/settings/"
    else
      flash[:alert] = "Your profile was not updated"
      render "/settings/"
    end
  end

  def user_params
    params.require(:user).permit(:first_name, :last_name, :organization_id)
  end

end