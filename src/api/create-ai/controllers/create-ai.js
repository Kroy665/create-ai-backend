'use strict';

/**
 *  create-ai controller
 */

const { createCoreController } = require('@strapi/strapi').factories;



// import { Configuration, OpenAIApi} from "openai";
const { Configuration, OpenAIApi} = require("openai");

async function createAns(prompt){
    // const maxToken = 264;
    
    
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    try{
        console.log("prompt::",prompt)
        const response = await openai.createCompletion({
            model: "text-davinci-002",
            prompt: prompt,
            temperature: 0.7,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          });

        

        return {
            success: true,
            error: null,
            data: response.data.choices[0].text
        }
    }catch(error){
        console.log("OpenAi:",error)
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

        console.log("body::",prompt)
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
        console.log("entity::",entity)
        const ans = await createAns(prompt);
        
        if(entity){

            var usedToken = entity.usedToken | 0;

            console.log("usedToken::",usedToken)
            console.log("ans length::",ans.data.length)
            const result = await strapi.db.query('plugin::users-permissions.user').update({
                where: {
                    id
                },
                data: {
                    "usedToken": usedToken + ans.data.length,
                }
            }
            );
            console.log("result::",result)
        }







        const sanitizedEntity = await this.sanitizeOutput(ans);
        return this.transformResponse(sanitizedEntity);
        
        
    }
}));
