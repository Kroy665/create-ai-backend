'use strict';

/**
 *  create-ai controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const axios = require('axios');

async function createAns(prompt) {
    // const maxToken = 264;
    try {
        console.log("prompt::", prompt)
        var data = JSON.stringify({
            "text": prompt,
        });

        var config = {
            method: 'post',
            url: 'http://127.0.0.1:5000/api/v1/create-summarize',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        var response = await axios(config)
        console.log("response::", response.data)





        return {
            success: true,
            error: null,
            data: response.data.data
        }
    } catch (error) {
        console.log("OpenAi:", error)
        return {
            success: false,
            error: error,
            data: null
        }
    }

}





module.exports = createCoreController('api::create-ai.create-ai', ({ strapi }) => ({

    async createAns(ctx) {

        const { prompt } = ctx.request.body;

        console.log("body::", prompt)
        var id;
        if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
            // use the current system with JWT in the header
            const decoded = await strapi.plugins[
                'users-permissions'
            ].services.jwt.getToken(ctx);

            id = decoded.id;
            console.log("ID::", id)
        }
        const entity = await strapi.db.query('plugin::users-permissions.user').findOne({
            where: { id }
        });
        console.log("entity::", entity)
        const ans = await createAns(prompt);

        if (entity) {

            var usedToken = entity.usedToken | 0;

            console.log("usedToken::", usedToken)
            console.log("ans length::", ans.data.length)
            const result = await strapi.db.query('plugin::users-permissions.user').update({
                where: {
                    id
                },
                data: {
                    "usedToken": usedToken + ans.data.length,
                }
            }
            );
            console.log("result::", result)
        }







        const sanitizedEntity = await this.sanitizeOutput(ans);
        return this.transformResponse(sanitizedEntity);


    }
}));
