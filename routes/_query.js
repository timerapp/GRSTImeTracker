import moment from "moment";

const _q = (request) => {
    let f = new Date(request.query.from).toISOString()
    let t = new Date(request.query.to).toISOString()
    //console.log(f,t);
    return {
        token: request.query.token,
        userid: request.query.userid,
        f: moment(f).format(),
        t: moment(t).format()
    }
}

export default _q