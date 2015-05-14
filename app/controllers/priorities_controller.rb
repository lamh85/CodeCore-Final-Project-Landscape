class PrioritiesController < ApplicationController

  def update
    priority = Priority.find(params[:id])
    old_name = priority.name
    priority.update(priority_params)
    redirect_to "/settings/", notice: "Priority tag successfully renamed from \"#{old_name}\" to \"#{priority.name}\""
  end

  def create
    @priority_new = Priority.new(priority_params)
    if @priority_new.save
      redirect_to "/settings/", notice: "Priority tag successfully created as \"#{@priority_new.name}\"."
    else
      redirect_to "/settings/", alert: "We cannot create your priority tag."
    end
  end

  def destroy
    priority = Priority.find(params[:id])
    name = priority.name
    priority.destroy
    redirect_to "/settings/", notice: "You have successfully deleted your tag \"#{name}\"."
  end

  def priority_params
    params.require(:priority).permit(:name)
  end
end
