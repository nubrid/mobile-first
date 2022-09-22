describe "main", ->
	before ->
		require "main"
	it "should assign globals", ->
		expect( window.url ).to.exist
		expect( window.jQuery ).to.exist
		expect( $ ).to.exist
	it "should initialize jQuery Mobile", ( done ) ->
		$( document ).on "mobileinit", () ->
			done()