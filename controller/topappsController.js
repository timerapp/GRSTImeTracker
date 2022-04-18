import _auth from '../routes/_auth.js'
import _q from '../routes/_query.js';
import Activities from '../model/activity.js'

function ToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay; 
}

const Get = (req,res)=>{
    let {token,userid,f,t} = _q(req)

    _auth(token)
    .then(par=>{

        if(par.status!==404){
            
            let lmt = new URLSearchParams(req.url);
            let limit = (lmt.has('limit')===true) ? parseInt(req.query.limit) : 5
    
            var pipeline = [
                {$match: {
                        user_id: userid,
                        date : {$gte: f,$lt: t}
                    }
                },
                {$unwind:"$apps"},
                { $group : 
                    { 
                        _id : {name : '$apps.name', rating : "$apps.rating" },
                        total: {$sum:'$apps.total'}
                    }
                },
                {$sort: {total:-1} },
                {$limit: limit},
                
            ]
            const data = []
            Activities.aggregate(pipeline)
            .then((r)=>{
                const dt = r.map(({_id, total})=>{
                    return {
                        "name": _id.name,
                        "rating": _id.rating,
                        "total": total//ToHms(total)
                    }
                })
                data.push(dt)
    
                res.json(data);
            })
            .catch(re=>{
                //console.log(re);
            })
        }else{
            res.json(par)
        }



    }) 
}

export default {Get}