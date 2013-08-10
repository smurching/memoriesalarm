class Group < ActiveRecord::Base
  attr_accessible :name, :user_id, :token_id
  
  has_and_belongs_to_many :users, :uniq => true
  has_many :contents
  
end
