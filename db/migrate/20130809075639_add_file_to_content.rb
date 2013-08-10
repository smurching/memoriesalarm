class AddFileToContent < ActiveRecord::Migration
  def change
    add_attachment :contents, :content_file    
  end
end
