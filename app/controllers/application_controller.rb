class ApplicationController < ActionController::Base
  protect_from_forgery
  
    # Returns the currently logged in user or nil if there isn't one
    def current_user
      return unless session[:user_id]
      @current_user ||= User.find_by_id(session[:user_id]) 
    end

    # Make current_user available in templates as a helper
    helper_method :current_user

    # Predicate method to test for a logged in user    
    def logged_in?
      current_user.is_a? User
    end

    # Make logged_in? available in templates as a helper
    helper_method :logged_in?
      
end
