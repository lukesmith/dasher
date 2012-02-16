$: << File.dirname(__FILE__) + "/lib"

require 'sinatra'

require 'routes'

class Dasher < Sinatra::Application

  set :root, File.dirname(__FILE__)
  set :app_file, __FILE__

end