class Token < ActiveRecord::Base
  attr_accessible :group_id, :user_id, :value
  belongs_to :user
  belongs_to :group
  
end
