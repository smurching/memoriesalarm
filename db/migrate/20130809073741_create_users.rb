class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.integer :group_id
      t.string :name
      t.string :password
      t.timestamps
    end
  end
end
