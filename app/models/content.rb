class Content < ActiveRecord::Base
  attr_accessible :group_id, :user_id, :content_file, :title
  has_attached_file :content_file, :styles => { :medium => "300x300>", :thumb => "100x100>" }#, :s3_credentials => "public/aws3.yml", :bucket => "alarm", :url => ":memoriesalarm.s3.amazonaws.com"   
  
  belongs_to :user
  belongs_to :group
  
  # validates :title, :presence => :true
  
  def content_file_url
    original = content_file.url
    return original.split("s3").insert(1, "s3-us-west-2").join
  end
end
