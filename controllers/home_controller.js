module.exports.home = function(req, res){
    console.log(req.cookies);
    res.cookie('user_id', 25);
    // return res.end('<h1>Express is up for connect_i</h1>');
    return res.render('home', {
        title: "Home"
    });
}