class RemoveUsersFromGroups < ActiveRecord::Migration
  def change
    remove_column :users, :group_id
    if column_exists? :groups, :user_id
      remove_column :groups, :user_id
    end
  end
end
