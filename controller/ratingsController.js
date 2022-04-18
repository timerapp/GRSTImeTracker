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
    let {token, userid,f,t} = _q(req)

    _auth(token)
    .then(par=>{

        if (par.status!==404) {
            
            let lmt = new URLSearchParams(req.url);
            let limit = (lmt.has('limit')===true) ? parseInt(req.query.limit) : 5
    
    
            var pipeline1 = [
                {$match: {
                        user_id: userid,
                        created_at : {$gte:f,$lt:t}
                    }
                },
                
                {$unwind:"$apps"},
                { $group : 
                    {   
                        _id : '$apps.rating', 
                        appTotal: {$sum:"$apps.total"},
                        totalCount: { $sum: 1 }
                    }
                },
                {$sort: {apps:-1} },
                //{$limit: limit},
                
            ]
    
            var pipeline2 = [
                {$match: {
                        user_id: userid,
                        date : {$gte: f,$lt: t}
                    }
                },
                
                {$unwind:"$apps"},
                { $group : 
                    {   
                        _id : { 
                            date: {
                                $dateToString: {
                                    date: "$created_at",
                                    format: "%Y-%m-%d",
                                    timezone: "Asia/Manila"
                                }
                            },
                            rating:"$apps.rating"
                        },
                        appTotal: {$sum:"$apps.total"},
                        totalCount: { $sum: 1 },
                        ptotal: {$sum:"$partialTotal"}
                    }
                },
                {
                    $project : {
                        _id: "$_id.date",
                        name: "$_id.rating",
                        totalCount: "$totalCount",
                        appTotal : "$appTotal",
                        pTotal: "$ptotal"
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        rating: {$push: { name:"$name", totalCount:"$totalCount", appTotal:"$appTotal"} },
                        count: {$sum: "$totalCount"},
                        total: {$sum:"$appTotal"},
                        pTotal: {$sum: "$pTotal"}
                    }
                },
                {$sort: {_id:1} },
                //{$limit: limit},
                
            ]
            const data = []
            Activities.aggregate(pipeline2)
            .then((r)=>{
                let tt = 0
                let totalWorked = 0
                const dt = r.map(({_id/*,name,totalCount,appTotal*/})=>{
    
                    tt+=_id.totalCount
                    totalWorked +=_id.appTotal
                    return {
                        "date": _id.date,
                        "name": _id.name,
                        "total":_id.totalCount,
                        "appTotal":_id.appTotal
                    }
                })
                
                let ds = dt.map( ({date,name,total,appTotal})=>{
                    
                    return {
                        "date": date,
                        "name": name,
                        "Percentage": totalWorked,//(total/tt) * 100,
                        "Total": ToHms(appTotal)
                    }
                } )
                let fnl = {
                    "totalTime": ToHms(totalWorked),
                    "rating": ds
                }
                data.push(fnl)
    
                const dtr = r.map(({_id,total,rating,count,pTotal})=>{
                    let rate = rating.map(({name,totalCount,appTotal})=>{
                        return {
                            "name": name,
                            "count": (totalCount/count)*100,
                            "appTotal": appTotal
                        }
                    })
                    return {
                        "date": _id,
                        "total": total,
                        "ptotal": pTotal,
                        "ratings": rate
                    }
                })
    
                res.json(dtr);
            })
            .catch(re=>{
                //console.log(re);
            })
        }else{
            res.json(par)
        }

    })
}


export default {Get};
    