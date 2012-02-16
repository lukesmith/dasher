require ::File.join( ::File.dirname(__FILE__), 'application')

require 'bundler'

Bundler.require

run Dasher.new
