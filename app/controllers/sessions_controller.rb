class SessionsController < ApplicationController
  def login
    user = User.login(params[:email], params[:password])
    if user
      session[:user_id] = user.id
      respond_to do |format|
        format.html {redirect_to root_path, notice: "Logged in successfully"}
        format.js
      end
    else
      respond_to do |format|
        format.html {redirect_to root_path, notice: "Your email and password didn't seem to match. Please try again."}
        format.js
      end
    end      
  end

  
  def logout
    reset_session
    respond_to do |format|
      format.html {redirect_to root_path, notice: "Logged out"}
      format.js
    end
  end
  
  def login_form
    respond_to do |format|
      format.html 
      format.js
    end
  end
  
end
