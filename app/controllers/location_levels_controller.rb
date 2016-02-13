class LocationLevelsController < ApplicationController
    def save
        # byebug
        # render text: params
=begin
(byebug) params
    {"level"=>3, "name"=>"UN-NAMED LEVEL", "thread"=>nil, "controller"=>"location_levels", "action"=>"save", "location_level"=>{"name"=>"UN-NAMED LEVEL", "level"=>3, "thread"=>nil}}
(byebug) params[:location_level]
    {"name"=>"UN-NAMED LEVEL", "level"=>3, "thread"=>nil}
(byebug) params[:location_level]["name"]
    UN-NAMED LEVEL
=end
    end

    def get_all
        levels = LocationLevel.all
        render text: levels.to_json
    end

    def index
        @extra_scripts = ['location_levels_angular']
        render 'index'
    end

    def destroy
    end
end
