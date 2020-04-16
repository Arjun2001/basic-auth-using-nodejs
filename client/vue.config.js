const path = require('path');

module.exports = {
    outputDir : path.resolve(__dirname, '../server/public'),
    devServer: {
        proxy: {
            'api/v1/notes' :{
                target: 'http://localhost:5000/'
            },
            '/auth/signup' :{
                target: 'http://localhost:5000/'
            },
            '/auth/login' :{
                target: 'http://localhost:5000/'
            }
        }
    }
}
