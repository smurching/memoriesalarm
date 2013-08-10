class CreateTokens < ActiveRecord::Migration
  def change
    create_table :tokens do |t|
      t.string :value
      t.integer :group_id
      t.integer :user_id
      t.integer :sender_id

      t.timestamps
    end
  end
end
