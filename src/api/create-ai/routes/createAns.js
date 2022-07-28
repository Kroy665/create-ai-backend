module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/create-ai/create-ans',
            handler: 'create-ai.createAns',
            config: {
                find: {
                  auth: true
                }
              }
        }
    ]
}