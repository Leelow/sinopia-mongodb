const mongoose = require( 'mongoose' )

var SinopiaUserSchema = new mongoose.Schema( {

    shared_id: {type: String, required: true, unique: true},
    type: {type: String, required: true, enum: ['client', 'user']},
    name: {type: String, required: true},
    enabled: {type: Boolean, default: false},
    token: {type: String},
    allowed_until: {type: Date},
    last_auth: {type: Date},
    last_download: {type: Date},
    download: {type: Number, default: 0}

}, {

    toObject: {
        transform: function ( doc, ret ) {
            ret.id = ret._id
            delete ret._id
            delete ret.__v
        }
    }

} )

/** Check client name **/
SinopiaUserSchema.path( 'name' ).validate( function ( value ) {
    return /^[a-z0-9-]+$/g.test( value )
}, 'User name must only contains letters, numbers and "-".' )


/** Force validation when update **/
SinopiaUserSchema.pre( 'findOneAndUpdate', function ( next ) {
    this.options.new = true
    this.options.runValidators = true
    next()
} )

module.exports = mongoose.model( 'sinopia_user', SinopiaUserSchema )