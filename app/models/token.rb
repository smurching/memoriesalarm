class Token < ActiveRecord::Base
  attr_accessible :group_id, :user_id, :value
  belongs_to :group
  
  
  def self.generate_value
    array = Array.new(20)
    value = array.map{(97+rand(26)).chr}.join      
  end
end
