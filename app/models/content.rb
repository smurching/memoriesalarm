class Content < ActiveRecord::Base
  attr_accessible :group_id, :user_id, :content_file, :title
  has_attached_file :content_file, :styles => { :medium => "300x300>", :thumb => "100x100>" }#, :s3_credentials => "public/aws3.yml", :bucket => "alarm", :url => ":memoriesalarm.s3.amazonaws.com"   
  validates_attachment :content_file, :size => { :in => 0..1000.kilobytes}, :message => "Make sure you've uploaded a file (png/jpg up to 1 MB)", :presence => true
  
  belongs_to :user
  belongs_to :group
  
  # validates :title, :presence => :true
  
  def content_file_url(style=:original)
    original = content_file.url
    styles_hash = {:thumb => "thumb", :medium => "medium", :original => "original"}
    
    # modify so that domain name of file src attribute is correct
    modified = original.split("s3").insert(1, "s3-us-west-2").join
    
    # modify so that file is sized properly
    final = modified.split("original").insert(1, styles_hash[style]).join   
    
    if content_file_content_type["image"] != nil
      return final
    else
      return modified
    end

    
  end
  
  def truncated_title
    if title != nil && title.length > 40
      title = title.slice(0, 40)+"..."
    end
    return title
  end
  
  def pretty_title(split=30)
    output = ""
    num_of_splits = (title.length/split).floor
    
    if num_of_splits != 0
      (1..num_of_splits).each do |i|
          output += title.slice(split*(i-1), split*(i))+"...\n"    
      end
      
      output += title.slice( split*(num_of_splits), title.length+1)
    
    
    else
      output = title
    end
    
    return output
    
  end
  
  def owner
    return User.find(user_id)
  end
  
end
