#!/usr/bin/env node
/** 
   Programme Code:   IT524120P
   Programme Name:   PC in Stack Web Development
   Student Id:       214083118 
   Student Name:     Lee Wai Po
   Submission Date:  9 July 2022
   Course Work:      IT524049Q Serverless Applications Development on Cloud Module (C)
   Script Id:        route.js
   Description:      The implementation of the router for the application.
                     It routes users requests, processes the requests, and then
                      generates appropriate response to the users.
   Requirement:
      1. Implement the endpoints for the currency pair of the exchange application. 
         All currency codes must be published on the list of Currency Codes ISO 4217.
         The base currency is configured to the currency - EUR by the API provider.
         The counter currency refers to the second currency in a currency pair. 
         (GET) /exchange/ccy1       Get the currency exchange rate of ccy1 from http://data.fixer.io/api
                                     E.g. EUR/USD means the Euro vs the U.S. dollar 
         (GET) /exchange/ccy1/ccy2  Get the currency exchange rate of ccy1 and ccy2 from http://data.fixer.io/api
                                     Then calculate the cross currency exchange rate for the currency pair.
                                     E.g. EUR/GBP ÷ EUR/USD => GBP/USD means the British Pound vs the U.S. dollar
          Note: both ccy1 and ccy2 must be an ISO currency code. The HTTP response status code will be set to 200 upon completion.
          Otherwise, the HTTP response status code will be set to 400.

*/
"use strict"

const request = require( "request" )
const { format } = require( "date-fns" )

async function getExchangeRate() {

   return new Promise( ( resolve, reject ) => {

      const url = "http://data.fixer.io/api/latest?access_key="

      request.get( url, ( error, response, body ) => { 
         try {

         // Check completion status of the request
            if ( error ) {
               throw new TypeError( error )
            }
   
         // Get Last Updated Date and its Timestamp, and Exchange Rates 
            if ( !error && response.statusCode === 200 ) {
               const rawData = JSON.parse( body )
               if ( rawData.success ) {
                  const fxRates = rawData.rates
                  const ddmmmyyyy = format( new Date( rawData.date ), "dd-MMM-yyyy" )
                  const hhmmss = new Date( rawData.timestamp * 1000 ).toLocaleTimeString()
                  resolve( { "fxRates" : fxRates, "lastUpdated" : ddmmmyyyy + " " + hhmmss } )
               } else { 
                  reject( rawData.error.info )
                  throw new TypeError( rawData.error.info )
               }
            } else {
               reject( response.statusCode )
               throw new TypeError( response.statusCode )
            }
         }
         catch ( error ) {
            console.error( error.message )
            reject( error.message )
         }
      } )
   } )

}

async function getCounterCcyRate( toCcy ) {

   return new Promise( ( resolve, reject ) => {
      getExchangeRate()
       .then( ( fxRateInfo ) => { 
      // The base currency is configured to the currency - EUR by the API provider.
         const baseCcy = "EUR"
         const fxRates = fxRateInfo[ "fxRates" ]
         if ( fxRates[ toCcy ] === undefined || fxRates[ toCcy ] === null ) {
            throw new Error( `Invalid currency pair - ${baseCcy}/${toCcy}` )
         } 
         const currencyPair = baseCcy + "/" + toCcy
         const exchangeRate = fxRates[ toCcy ]
         const lastUpdated = fxRateInfo[ "lastUpdated" ]
         const exchangeInfo = { currencyPair, exchangeRate, lastUpdated }
         const rc =  JSON.stringify( exchangeInfo ) 
         resolve( rc )
       } )
       .catch( ( error ) => { 
         const rc = JSON.stringify( { "code" : 500, "body" : error.message } ) 
         reject( rc )
       } )
   } )
}

async function getCrossCcyRate( fmCcy, toCcy ) {

   return new Promise( ( resolve, reject ) => {
      getExchangeRate()
       .then( ( fxRateInfo ) => { 
         const fxRates = fxRateInfo[ "fxRates" ]
         if ( ( fxRates[ fmCcy ] === undefined || fxRates[ fmCcy ] === null ) 
           || ( fxRates[ toCcy ] === undefined || fxRates[ toCcy ] === null ) ) {
            throw new Error( `Invalid currency pair - ${fmCcy}/${toCcy}` )
         } 
      // const baseCcy = "EUR" // The base currency will be offset during cross-currency calculation
      //  E.g. EUR/GBP ÷ EUR/USD => GBP/USD means the British Pound vs the U.S. dollar
         const currencyPair = fmCcy + "/" + toCcy 
         const exchangeRate = fxRates[ toCcy ] / fxRates[ fmCcy ] 
         const lastUpdated = fxRateInfo[ "lastUpdated" ]
         const exchangeInfo = { currencyPair, exchangeRate, lastUpdated }
         const rc =  JSON.stringify( exchangeInfo )
         resolve( rc )
      } )
       .catch( ( error ) => { 
         const rc = JSON.stringify( { "code" : 500, "body" : error.message } ) 
         reject( rc )
       } )
   } )

}

module.exports.get = async ( route ) => {

// The first element of the array - route is equal to the value of ''. 
   if ( route.length === 3 ) {
      return getCounterCcyRate( route[2].toUpperCase() ) 
   } else if ( route.length === 4 ) { 
      return getCrossCcyRate( route[2].toUpperCase(), route[3].toUpperCase() ) 
   } else {
      return { "code" : 404, "body" : "Not Found" }
   }

}
