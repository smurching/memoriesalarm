class Content < ActiveRecord::Base
  attr_accessible :group_id, :user_id, :content_file, :title
  has_attached_file :content_file, :styles => { :medium => "300x300>", :thumb => "100x100>" }#, :s3_credentials => "public/aws3.yml", :bucket => "alarm", :url => ":memoriesalarm.s3.amazonaws.com"   
  
  belongs_to :user
  belongs_to :group
  
  
end
