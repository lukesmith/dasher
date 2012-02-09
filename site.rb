require 'sinatra'
require 'json'
require 'date'
require "teamcity-rest-client"

set :haml, :format => :html5

get '/' do
  haml :dashboard
end

get '/exceptions' do
  content_type :json

  date = DateTime.new(2001,2,3)
  [ { :Time => date, :NumberOfExceptions => 3}, { :Time => DateTime.new(2001,2,4), :NumberOfExceptions => 1 }].to_json
end

get '/teamcity' do
  client = Teamcity.new("teamcity.codebetter.com", 80, { :user => 'guest', :password => 'guest'})
  build_types = client.build_types.map { |d| { :project_id => d.project_id, :id => d.id, :project_name => d.project_name }}
  builds = client.builds.map { |d| { :build_type_id => d.build_type_id, :status => d.status }}

  result = []
  build_types.each do |d|
    build = builds.select { |t| d[:id] == t[:build_type_id] }
    result << { :name => d[:project_name], :builds => build }
  end

  result.to_json
end

class DateTime
  def to_json(*)
    '"\/Date(' + strftime('%Q') + ')\/"'
  end
end