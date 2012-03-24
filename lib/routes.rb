require 'sinatra'
require 'net/http'
require 'json'
require 'date'
require 'haml'
require "teamcity-rest-client"

set :haml, :format => :html5

get '/' do
  haml :dashboard, :locals => { :host => request.host, :port => request.port }
end

get '/exceptions' do
  content_type :json

  now = Time.now
  (1..24*12).map { |date| { :Time => (now.to_time - date).to_datetime, :NumberOfExceptions => Random.rand(10) } }.to_json
end

get '/teamcity' do
  #client = Teamcity.new("teamcity.codebetter.com", 80, { :user => 'guest', :password => 'guest'})
  #build_types = client.build_types.map { |d| { :project_id => d.project_id, :id => d.id, :project_name => d.project_name }}
  #builds = client.builds.map { |d| { :build_type_id => d.build_type_id, :status => d.status }}

  result = []
  #build_types.each do |d|
    #build = builds.select { |t| d[:id] == t[:build_type_id] }
    #result << { :name => d[:project_name], :builds => build }
  #end

  result << { :name => 'project', :builds => [{:name => 'Build A', :status => :Passed }, {:name => 'Build B', :status => :Failed }]}
  result << { :name => 'Sample project', :builds => [{:name => 'Build A', :status => :Passed }, {:name => 'Build B', :status => :Failed }]}

  result.to_json
end

get '/proxy' do
  content_type :json

  url = URI.parse(params[:url])
  host, port = url.host, url.port if url.host && url.port
  req = Net::HTTP::Get.new(url.path)
  res = Net::HTTP.start(host, port) {|http|  http.request(req) }
  res.body
end

get '/remote_sample' do
  result = []
  result << { :name => 'Mary', :age => 12 }
  result << { :name => 'John', :age => 22 }
  result << { :name => 'Sarah', :age => 2 }
  result << { :name => 'Frank', :age => 55 }
  result << { :name => 'Jeff', :age => 42 }

  result.to_json
end

class DateTime
  def to_json(*)
    '"\/Date(' + strftime('%Q') + ')\/"'
  end
end