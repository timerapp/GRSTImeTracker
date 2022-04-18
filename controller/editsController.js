import mm from 'moment-timezone';
import _q from '../routes/_query.js';
import Activity from '../model/activity.js'

function ToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " m, " : " mins, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " sec") : "";
    return hDisplay + mDisplay + sDisplay; 
}

const Get = (req,res)=>{
    let {token,userid,f,t} = _q(req)

    var pipeline1 = [
        {$match: {
                user_id: userid,
                date: {$gte: f, $lt: t}
            }
        },
        //{$unwind:"$apps"},
        {$group : {
            _id: {$dateToString: {
                date: {$max: "$created_at"}, // created_at
                format: "%Y-%m-%d",
                timezone: "Asia/Manila" //timezone: "Asia/Manila"
            }}, 
            /* _id : { 
                $dateToString : {
                    date: { 
                        $dateFromString: {
                        dateString: {$max: '$date'},
                        //format: '%Y-%m-%d',
                        //timezone: 'Asia/Manila'
                        //</tzExpression>onError: <onErrorExpression>,
                        //</onErrorExpression>onNull: <onNullExpression>
                        }
                    },
                    format: "%Y-%m-%d",
                }
            }, */
            //_id: {$min:'$created_at'},
            total: {$sum:"$partialTime"}, // apps.total
            start: {$min:"$date"},
            end: {$max:"$date"},
            count: {$sum:1}
        }},
        {$sort:{_id:-1}}
    ]
    
    const data = []
    Activity.aggregate(pipeline1)
    .then((r)=>{
        let tt = 0
        const dt = r.map(({_id,total,start,end, count})=>{

            tt+=total
            return {
                "date": mm.tz(_id,"Asia/Manila").format("MMM Do YY"),
                "total": ToHms(total),
                "ins":mm.tz(start,"Asia/Manila").format('LT'),
                "out":mm.tz(end,"Asia/Manila").format('LT'),
                "count": count,
                "total_sec": total
            }
        })
        let ds = dt.map( ({ date,total,ins,out,count,total_sec })=>{
            return {
                "date":date,
                "total":total,
                "in":ins,
                "out":out,
                "count":count,
                "total_sec": total_sec
            }
        } )
        data.push({
            "totalTime":ToHms(tt),
            "range": ds
        })

        res.json(data);
    })
    .catch(re=>{
        //console.log(re);
    })
}

const Create = (req,res)=>{

}

const Update = (req,res)=>{
    let {token,userid,f,t} = _q(req)

    Activity.updateMany(
        { 
            user_id : userid, // Query
            date : {$gte: f,$lt: t}
        }, 
        { $inc :{ partialTime: parseFloat(req.query.value) } }, // Update */
        //{ $inc: { "apps.$[elem].total" : Number(p.value) } },
        //{ arrayFilters: [ { "elem.total": { $exists: true, $not: {$size: 0} } } ] },
        function (err, docs) { // Callback
            if (err){
                console.log(err)
            }
            else{
                res.json(docs);
            }
        }
    )
}

const Delete = (req,res)=>{
    
}

export default {Get,Create,Update,Delete}