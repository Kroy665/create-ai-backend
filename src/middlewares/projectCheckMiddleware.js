module.exports = (config, {strapi})=> {
    return async (ctx, next) => {
        const start = Date.now();
        // console.log("config::", config)
        // console.log("strapi::", strapi)
        // console.log("ctx::", ctx)

        var { email, identifier, projectId } = ctx.request.body
        console.log("email::", identifier)
        if(projectId){
            var entity;
            if(!email){
                entity = await strapi.db.query('plugin::users-permissions.user').findOne({
                    where: { email: identifier }
                });
            }else{
                entity = await strapi.db.query('plugin::users-permissions.user').findOne({
                    where: { email }
                });
            }
            console.log("entity::", entity)
            
            // verify the projectId
            if (entity) {
                if(entity.projectId == projectId) {
                    // console.log("projectId::", projectId)
                } else {
                    return {
                        success: false,
                        error: "projectId not match",
                        data: null
                    }
                }
            } else {
                return {
                    success: false,
                    error: "user not found",
                    data: null
                }
            }
        }else{
            return {
                success: false,
                error: "projectId not Given",
                data: null
            }
        }
    


        await next();
      };
};