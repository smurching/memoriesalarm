require 'bcrypt'

class User < ActiveRecord::Base
  include BCrypt
  attr_accessible :name, :password_hash_confirmation, :group_id, :password_hash, :email
  has_and_belongs_to_many :groups, :uniq => true   
  has_many :contents
  validates :email, :format => {:with => /\A[a-zA-Z0-9.-_]+@[a-zA-Z]+[.][a-zA-Z.]+\z/, :message => 'is not valid. Please input a valid email address'}  
  validates :name, :presence => true
  validates :email, :uniqueness => true
  
   
   
  #BCRYPT STUFF STARTS HERE
  
  def password # This is what is called whenever @user.password is referenced. Returns a Password object from the data in a stored encrypted hash
    if password_hash != nil
     @password ||= Password.new(password_hash)
    else
      return false
    end
  end

  def password_create(new_password) #params[:password] should be passed into this in a secure fashion
      @password = Password.create(new_password)
      password_hash = @password
  end



 def self.login(email, password)  #shouldn't be any params
    @user = User.find_by_email(email) # parameter here should be params[:email]
    if @user == nil || @user.password != password
      return false
    else
      return @user 
    end
 end
  
 def self.password_create(new_password)
  @password = Password.create(new_password)
  password_hash = @password
 end
 
 def all_content
   output = []
   groups = self.groups
   groups.each do |group|
    group.users.each do |user|
      user.contents.each do |content|
        unless output.include?(content)
          output << content
        end
      end
    end     
   end
 return all_content
 end

    
end
