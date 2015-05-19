class UsersController < ApplicationController

  # CREATE

  def new
    @user = User.new
  end

  def create
    user = User.new(user_params)
    if user.save
      session[:user_id] = user.id
      redirect_to "/"
      flash[:notice] = "You have sucessfully created your account."
    else
      render :new
      flash[:alert] = "We could not create your account."
    end
  end

  # READ


  # UPDATE

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

  # DESTROY

  # OTHER

  private

  def user_params
    params.require(:user).permit(
      :first_name,
      :last_name,
      :password,
      :password_confirmation,
      :organization_id)
  end

end