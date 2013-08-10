class MainController < ApplicationController
  def index
    @user = User.new
    @content = Content.new
    respond_to do |format|
      format.html
      format.js
    end 
  end
end
