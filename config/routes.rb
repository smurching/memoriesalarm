Birthdayalarm::Application.routes.draw do
  resources :users


  resources :contents


  resources :groups
  
  root :to => "main#index"
  
  match '/login' => "sessions#login", as: "login"
  match '/logout' => "sessions#logout", as: "logout"
  match '/login_form' => "sessions#login_form", as: "login_form"
  
  # Setting the alarm
  match '/alarm' => "main#set_alarm", as: "set_alarm"
  
  # Showing random content when the alarm goes off
  match '/random' => "contents#random_content", as: "random_content"
  
  # Showing a piece of content
  match '/contents/:id' => "contents#show", as: "show_content", :via => :get

  # Creating invites
  match '/groups/:id/invite' => "invites#create_invite", as: "create_invite", :via => :get
  
  # Showing and accepting invitations
  match '/invites/:value' => "invites#show_invite", as: "show_invite", :via => :get
  match '/invites/:value' => "invites#join", as: "join", :via => :post
   
  #List members of a group
  match '/group/:id/list' => "groups#list_members", as: "list_members"
  
  match '/channel' => "sessions#channel", as: "channel"
  
  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
