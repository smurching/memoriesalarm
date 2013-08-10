class GroupsController < ApplicationController
  # GET /groups
  # GET /groups.json
  
  def index
    @groups = Group.all
    
    @content = Content.new
    @user = User.new

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @groups }
    end
  end
  
  def invite
    group = Group.find(params[:id])
    recipient = User.find(params[:user_id])
    
    if logged_in? && recipient.id != current_user.id
      @token = Token.new
      @token.value = Token.generate_value    
      if @token.save
        respond_to do |format|
          format.html {"Invited "+recipient.name+" to join "+group.name}
          format.js
        end
      else
        respond_to do |format|
          format.html {"An error prevented your invitation from being sent"}
          format.js
        end                
      end  
    end            
  end
  
  def join
    token = Token.find_by_value(params[:value])
    return unless token
    
    if token.user_id == current_user.id
      group = Group.find(token.group_id)
      group.users << current_user
      current_user.groups << group
    end
    
    group.save
    current_user.save
    
    respond_to do |format|
      format.html {redirect_to root_path, notice: "You successfully joined "+group.name+"!"}
      format.js
    end
    
  end

  # GET /groups/1
  # GET /groups/1.json
  def show
    @group = Group.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @group }
    end
  end

  # GET /groups/new
  # GET /groups/new.json
  def new
    @group = Group.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @group }
    end
  end

  # GET /groups/1/edit
  def edit
    @group = Group.find(params[:id])
  end

  # POST /groups
  # POST /groups.json
  def create
    @group = Group.new(params[:group])

    respond_to do |format|
      if @group.save
        @group.users << current_user
        @current_user.groups << @group
        format.html { redirect_to @group, notice: 'Group was successfully created.' }
        format.json { render json: @group, status: :created, location: @group }
      else
        format.html { render action: "new" }
        format.json { render json: @group.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /groups/1
  # PUT /groups/1.json
  def update
    @group = Group.find(params[:id])

    respond_to do |format|
      if @group.update_attributes(params[:group])
        format.html { redirect_to @group, notice: 'Group was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @group.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /groups/1
  # DELETE /groups/1.json
  def destroy
    @group = Group.find(params[:id])
    @group.destroy

    respond_to do |format|
      format.html { redirect_to groups_url }
      format.json { head :no_content }
    end
  end
end
