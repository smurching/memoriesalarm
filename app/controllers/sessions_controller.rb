class SessionsController < ApplicationController
  def login
    user = User.login(params[:email], params[:password_hash])
    
    if user
      session[:user_id] = user.id
      @logged_in = true
      respond_to do |format|
        format.html {redirect_to root_path, notice: "Logged in successfully"}
        format.js
      end
    else
      @logged_in = false
      respond_to do |format|
        format.html {redirect_to root_path, notice: "Your email and password didn't seem to match. Please try again."}
        format.js
      end
    end      
  end

  
  def logout
    reset_session
    respond_to do |format|
      format.html {redirect_to root_path}
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
