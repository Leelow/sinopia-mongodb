const mongoose = require( 'mongoose' )
const SinopiaUser = require( './lib/sinopiaUser.js' )

function SinopiaMongodb( config, sinopia ) {

    console.log( 'sinopia-mongodb plugin loaded.' )

    /** Connection to mongodb database **/
    if ( !config['host'] )
        throw new Error( 'Need a valid host in config file.' );

    var mongodb_uri = 'mongodb://' + config['host'] + ( config['port'] ? ':' + config['port'] : '') + '/' + (config['database'] ? config['database'] : '')
    mongoose.connect( mongodb_uri, function ( err ) {
        console.log( 'Connected to ' + mongodb_uri );
        if ( err )
            throw err
    } )

    /**
     * Always return a cb(null, true) to allow to add an user
     * @param user
     * @param password
     * @param callback
     * @returns {*}
     */
    this.adduser = function ( user, password, callback ) {
        return callback( null, true )
    };

    this.authenticate = function ( user, password, callback ) {

        // Find the
        SinopiaUser.findOne( {shared_id: user, token: password}, function ( err, doc ) {

            if ( err )
                return callback( err, null )

            if ( !doc )
                return callback( null, false )

            doc.last_download = new Date()
            doc.download += 1
            doc.save( function ( err ) {
                return callback( err, [user] )
            } )

        } )

    }

}

module.exports = function ( config, stuff ) {

    return new SinopiaMongodb( config, stuff )

};