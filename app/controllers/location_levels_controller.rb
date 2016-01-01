class LocationLevelsController < ApplicationController
    def create
    end

    def show
        levels = LocationLevel.all
        render text: levels.to_json
    end

    def update
    end

    def destroy
    end
end
