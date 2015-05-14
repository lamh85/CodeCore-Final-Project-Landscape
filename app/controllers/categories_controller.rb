class CategoriesController < ApplicationController

  def update
    category = Category.find(params[:id])
    old_name = category.name
    category.update(category_params)
    redirect_to "/settings/", notice: "Category successfully renamed from \"#{old_name}\" to \"#{category.name}\""
  end

  def create
    @category_new = Category.new(category_params)
    if @category_new.save
      redirect_to "/settings/", notice: "Category tag successfully created as \"#{@category_new.name}\"."
    else
      redirect_to "/settings/", alert: "We cannot create your category."
    end
  end

  def destroy
    category = Category.find(params[:id])
    name = category.name
    category.destroy
    redirect_to "/settings/", notice: "You have successfully deleted your category \"#{name}\"."
  end

  def category_params
    params.require(:category).permit(:name)
  end

end