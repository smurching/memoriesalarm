class AddUsersToGroups < ActiveRecord::Migration
  def change
    add_column :users, :group_id, :integer
    add_column :groups, :user_id, :integer
    
    create_table :groups_users do |t|
      t.integer :user_id
      t.integer :group_id
    end
  end
end
