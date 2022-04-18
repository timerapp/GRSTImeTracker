import _auth from '../routes/_auth.js'
import _q from '../routes/_query.js'
import Activities from '../model/activity.js'


function ToHms(d) {
    d = d?Number(d):0
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? "h : " : "h : ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? "m : " : "m : ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "00";
    return hDisplay + mDisplay + sDisplay; 
}


const Get = (req,res)=>{
    let {token,userid,f,t} = _q(req)

    _auth(token)
    .then(par=>{

        if(par.status!==404){
            let total_sec = async ()=>{
                return await _auth('','edits',`userid=${userid}&from=${req.query.from}&to=${req.query.to}`)
            }


            let lmt = new URLSearchParams(req.url);
            let limit = (lmt.has('limit')===true) ? parseInt(req.query.limit) : 5
    
    
            var pipeline1 = [
                {$match: {
                        user_id: userid,
                        date : {$gte: f,$lt: t}
                    }
                },
                
                {$unwind:"$apps"},
                { $group : 
                    {   
                        _id : '$apps.rating', //apps.rating
                        appTotal: {$sum:"$apps.total"},
                        totalCount: { $sum: 1 }
                    }
                },
                {$sort: {date:-1} },
                //{$limit: limit},
                
            ]
    
            var pipeline2 = [
                {$match: {
                        name: req.query.user,
                        created_at : {$gte: new Date(f),$lt: new Date(t)}
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
                                }
                            },
                            rating:"$apps.rating"
                        },
                        appTotal: {$sum:"$apps.total"},
                        totalCount: { $sum: 1 }
                    }
                },
                {
                    $project : {
                        _id: "$_id.date",
                        name: "$_id.rating",
                        totalCount: "$totalCount",
                        appTotal : "$appTotal"
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        rating: {$push: { name:"$name", totalCount:"$totalCount", appTotal:"$appTotal"} },
                        count: {$sum: "$totalCount"},
                        total: {$sum:"$appTotal"}
                    }
                },
                {$sort: {_id:-1} },
                //{$limit: limit},
                
            ]

            var pipeline3 = [
                { $match: {
                        user_id: userid,
                        date : {$gte: f,$lt: t}
                    }
                },
                {$unwind: '$apps'},
                {
                    $group: {
                        _id : '$apps.rating',
                        total: {$sum: '$apps.total'},
                        count: {$sum:1}
                    }
                },
                {
                    $project: {
                        _id:0,
                        rating: '$_id',
                        total: '$total',
                        count: '$count'
                    }
                }
            ]
            const data = []
            Activities.aggregate(pipeline3)
            .then(async(r)=>{

                let prod = r.filter(({rating})=>rating==='prod')[0] || 0
                let unprod = r.filter(({rating})=>rating==='unprod')[0] || 0
                let unrated = r.filter(({rating})=>rating==='Unrated')[0] || 0

                let total = (prod.total??0)+(unprod.total??0)+(unrated.total??0)

                let count = r.map(({count})=> count).reduce((a, b) => a + b)
                let secs = await total_sec()
                //let tts = secs[0]?.range[0]?.total_sec

                let tts = secs[0]?.range.map(({total_sec})=>total_sec).reduce((a, b)=>a+b)

                res.json({
                    rating:{
                        prod: ToHms(tts*(prod?.total/total)) || 0,
                        unprod: ToHms(tts*(unprod.total/total)) || 0,
                        unrated: ToHms(tts*(unrated?.total/total)) || 0,
                        prod_percent: (prod?.total/total)*100 || 0,
                        unprod_percent: (unprod.total/total)*100 || 0,
                        unrated_percent: (unrated?.total/total)*100 || 0,
                    },
                    totalTime: ToHms(tts),
                    counts: count,
                    total: total
                })
            })
            .catch(re=>{
                //console.log(re);
            })
        }else{
            res.json(par)
        }

    })
}

const Create = (req,res)=>{
    
}

const Update = (req,res)=>{
    
}

const Delete = (req,res)=>{
    
}

export default {Get,Create,Update,Delete}