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
    var sDisplay = s > 0 ? s + (s == 1 ? "s : " : "s") : "00";
    return hDisplay + mDisplay + sDisplay; 
}


const Get = (req,res)=>{
    let {token,userid,f,t} = _q(req)

    
    var pipeline = [
        {$match: {
                user_id: userid,
                date : {$gte: f,$lt: t}
            }
        },
        
        { $group : 
            {   
                _id : {
                        $dateToString: {
                            date: "$created_at", // created_at
                            format: "%Y-%m-%d",
                            timezone: "Asia/Manila"
                        }
                },
                idletime : {$sum: '$idleTime'} 
            }
        },
        {$sort:{_id:1}}
        
    ]

    Activities.aggregate(pipeline)
    .then((r)=>{

        //const total = r.map(({idletime})=>idletime)?.reduce((a,b)=>a+b)
        res.json({
            //total,
            range: r

        })
        
    })
    .catch(re=>{
        console.log(re);
    })
}

export default {Get};