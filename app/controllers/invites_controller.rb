class InvitesController < ApplicationController
  
  def create_invite
    @group = Group.find(params[:id])
    
    if logged_in?
      @token = Token.new({:group_id => @group.id, :user_id => current_user.id})
      @token.value = Token.generate_value    
      if @token.save
        @invite_sent = true
        respond_to do |format|
          # format.html {"Invited "+recipient.name+" to join "+group.name} - Commented out because a different sharing method is being used
          format.js
        end
      else
        @invite_sent = false
        respond_to do |format|
          # format.html {"An error prevented your invitation from being sent"}
          format.js
        end                
      end  
    end            
  end
  
  
  def show_invite    
    @token = Token.find_by_value(params[:value])
    if @token.user_id == current_user.id
      return redirect_to root_path
    end
    
    @group = Group.find(@token.group_id)
    @sender = User.find(@token.user_id)
    
    respond_to do |format|
      format.html
    end
    
  end  
  
  def join
    token = Token.find_by_value(params[:value])
    if token != nil
      
      group = Group.find(token.group_id)
      group.users << current_user
      current_user.groups << group
      
    
      group.save
      current_user.save      
 
      respond_to do |format|
        format.html {redirect_to root_path, notice: "You joined "+group.name}
      end
      
    else
    
      respond_to do |format|
        format.html redirect_to root_path, notice: "We couldn't find a group with the provided token value"
      end               
      
    end   
  end
  
    
end
