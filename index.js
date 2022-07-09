#!/usr/bin/env node
/** 
   Programme Code:   IT524120P
   Programme Name:   PC in Stack Web Development
   Student Id:       214083118 
   Student Name:     Lee Wai Po
   Submission Date:  9 July 2022
   Course Work:      IT524049Q Serverless Applications Development on Cloud Module (C)   
   Script Id:        index.js
   Description:      The implementation of the driver for the application.
                     It is the entry point for the application; and then
                     routes users requests, processes the requests, and 
                      generates appropriate response to the users finally.
   Requirement:
      1. Implement the endpoints for the currency exchange application. 
         The base currency is configured to the currency - EUR by the API provider.
         (GET) /exchange/ccy1       Get the currency exchange rate of ccy1 from http://data.fixer.io/api
                                     E.g. EUR/USD means the Euro vs the U.S. dollar 
         (GET) /exchange/ccy1/ccy2  Get the currency exchange rate of ccy1 and ccy2 from http://data.fixer.io/api
                                     Then calculate the cross currency exchange rate for the currency pair.
                                     E.g. EUR/GBP ÷ EUR/USD => GBP/USD means the British Pound vs the U.S. dollar
          Note: both ccy1 and ccy2 must be an ISO currency code. The HTTP response status code will be set to 200 upon completion.
          Otherwise, the HTTP response status code will be set to 400.

*/
"use strict"

const express = require( "express" )
const url = require( "url" )
const r = require( "./route" )

const app = express(), PORT = 3000

async function getExchangeRate( uri ) {

   return new Promise( ( resolve, reject ) => {
      r.get( uri )
       .then( ( returnCode ) => { 
         resolve( returnCode ) 
         } )
       .catch( ( returnCode ) => { 
         reject( returnCode ) 
        } )
   }  ) 

}

async function getExRateHandler( request, response ) { 

   const uri = request.originalUrl.split( "/" ) 
// The first element of the array - uri is equal to the value of ''.
   let done = Boolean
   try {
      if ( ( uri.length === 3 || uri.length === 4 ) && ( uri[1].toLowerCase() === "exchange" ) ) { 
         const returnCode = await getExchangeRate( uri )
         response.setHeader( "content-type", "application/json" )
         response.status( 200 ).send( JSON.stringify( { "code" : 200, "body" : returnCode }, null, "" ) ) 
         done = true 
      } else {
         response.setHeader( "content-type", "application/json" )
         response.status( 400 ).send( JSON.stringify( { "code" : 400, "body" : "Bad Request" }, null, "" ) )
         done = false 
      }
   } catch ( error ) { 
      const { code, body } = JSON.parse( error ) 
      response.setHeader( "content-type", "application/json" )
      response.status( code ).send( JSON.stringify( { "code" : code, "body" : body }, null, "" ) ) 
      done = false
   }
   return done 

}

app.use( "*", function( request, response, context ) {

   switch ( request.method ) {
      case "GET" :
         getExRateHandler( request, response )
         break
      default : 
         response.setHeader( "content-type", "application/json" )
         response.status( 400 ).send( JSON.stringify( { "code" : 400, "body" : "Bad Request" }, null, "" ) )
      }

 } )

app.listen( PORT, () => console.log( `Express server currently running on port ${ PORT }` ) )
