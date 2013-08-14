class ContentsController < ApplicationController
  # GET /contents
  # GET /contents.json
  def index
    @contents = current_user.contents

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @contents }
    end
  end

  # GET /contents/1
  # GET /contents/1.json
  def show
    @content = Content.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @content }
    end
  end

  # GET /contents/new
  # GET /contents/new.json
  def new
    @content = Content.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @content }
    end
  end
  
  def random_content
    @contents = current_user.all_content
    @content = @contents[rand(@contents.length)]
    respond_to do |format|
      format.html
      format.js
    end
  end

  # GET /contents/1/edit
  def edit
    @content = Content.find(params[:id])
  end

  # POST /contents
  # POST /contents.json
  def create
    @content = Content.new(params[:content])

    respond_to do |format|
      if @content.save
        @content.user = current_user
        current_user.contents << @content        
        format.html { redirect_to @content}
        format.json { render json: @content, status: :created, location: @content }
      else
        format.html { redirect_to root_path, notice: "Content could not be saved" }
        format.json { render json: @content.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /contents/1
  # PUT /contents/1.json
  def update
    @content = Content.find(params[:id])

    respond_to do |format|
      if @content.update_attributes(params[:content])
        format.html { redirect_to @content, notice: 'Content was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @content.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /contents/1
  # DELETE /contents/1.json
  def destroy
    @content = Content.find(params[:id])
    @content.destroy

    respond_to do |format|
      format.html { redirect_to root_path, :notice => "Successfully deleted content" }
      format.json { head :no_content }
    end
  end
end
