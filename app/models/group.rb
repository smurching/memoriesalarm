class Group < ActiveRecord::Base
  attr_accessible :name, :user_id, :token_id
  
  has_and_belongs_to_many :users, :uniq => true
  has_many :contents
  validates :name, :presence => true
  
 def all_content
   output = self.contents
   self.users.each do |user|
    user.contents.each do |content|
      unless output.include?(content)
        output << content
      end
    end
   
   end     
   
 return output
 end
  
end
