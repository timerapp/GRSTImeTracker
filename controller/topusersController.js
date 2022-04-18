import _auth from '../routes/_auth.js'
import mm from 'moment-timezone';
import activty from '../model/activity.js'
import _q from '../routes/_query.js';

function ToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? "." : ".") : "0.";
    var mDisplay = m > 0 ? m + (m == 1 ? "." : ".") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? "." : ".") : "";
    return parseFloat(hDisplay + mDisplay)// + sDisplay; 
}


const Get = (req,res)=>{
    //let token = req.query.token;
    let {token, userid,f,t} = _q(req)

    //_auth(token)
    //.then(par=>{

        //if(par.status!==404){
            let from = mm.tz(f,"Asia/Manila").toISOString(true)
            let to = mm.tz(t,"Asia/Manila").toISOString(true)
            
            const timesheet = []
            const stage1 = [
                {
                    $match: {
                        date : {$gte: f,$lt: t}
                    }
                },
                //{ $unwind: '$apps'},
                {
                    $project:{
                        _id: '$user_id',
                        name: '$name',
                        total: '$partialTime',
                        created_at: '$created_at',
                        apps: '$apps'
                    },
                    //
                },
                //{ $match: {'apps.total': {$gt: 1} } },
                {
                    $group: {
                        _id: { id: '$_id', user: '$name'}, 
                        //name: {$push: {'$_id':0}},
                        apps: {$sum: '$total'}, // apps.total
                        total:{$sum:'$total'},
                        count: {$sum:1}
    
                    }
                }
            ]
            const stage2 = [
                {
                    $match: {
                        date : {$gte: from,$lt: to}
                    }
                },
                {
                    $project:{
                        _id: '$user_id',
                        name: '$name',
                        total: '$partialTime',
                        created_at: '$created_at',
                        apps: '$apps'
                    }
                },
                {
                    $group: {
                        _id: {
                            /*$dateToString : {
                                date: '$created_at',
                                format: '%Y-%m-%d'
                            } */
                            id: '$_id',
                            name: '$name',
                            date: {
                                $dateToString : {
                                    date: '$created_at',
                                    format: '%Y-%m-%d'
                                } 
                            }
                        },
                        total: {$sum: '$total'}
                    }
                },
                {
                    $project:{
                        _id: '$_id.id',
                        name: '$_id.name',
                        date: '$_id.date',
                        total: '$total'
                    }
                },
                {
                    $group:{
                        _id: '$_id',
                        name: {$push: '$name'},
                        total: {$sum: '$total'},
                        date: {$push: '$date'},
                        partial: {$push: '$total'}
                    }
                }
            ]
            activty.aggregate(stage2) 
            .sort({total:-1})
            .then(items=>{

                const user = items.map(({_id,name,total,date,partial})=>{

                    let rows = []
                    date.forEach((d,i) => {
                        
                        let row = {date : d, time: partial[i] }
                        rows.push(row)
                    })

                    return {
                        userid: _id,
                        total: total,
                        name: name[0],
                        data: rows
                    }   

                })
                res.json(user)
            })
            .catch(re=>{
                //console.log(re);
            })

            
        //}else{
        //    res.json(par)
        //}

    //})
}

const Create = (req,res)=>{
    const newActivity = new activty({
        name: req.body.name
    });

    newActivity.save().then(item => res.json(item));
}

const Update = (req,res)=>{

}

const Delete = (req,res)=>{

}

export default {Get,Create,Update,Delete}