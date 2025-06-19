var config = {}

config.mongoURI = {
    production: 'mongodb+srv://moringa:12345@gallery.gw7i9ol.mongodb.net/gallery?retryWrites=true&w=majority&appName=gallery',
    development: 'mongodb+srv://moringa:12345@gallery.gw7i9ol.mongodb.net/gallery-dev?retryWrites=true&w=majority&appName=gallery',
    test: 'mongodb+srv://moringa:12345@gallery.gw7i9ol.mongodb.net/gallery-test?retryWrites=true&w=majority&appName=gallery',
}
module.exports = config;