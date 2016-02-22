/**
 * Created by john on 26/1/16.
 */
Template.fbtest.onRendered(function () {
    window.fbAsyncInit = function () {
        FB.init({
            appId: '1681294222108898',
            cookie: true,  // enable cookies to allow the server to access
                           // the session
            xfbml: true,  // parse social plugins on this page
            version: 'v2.2' // use version 2.2
        });

        FB.getLoginStatus(function (response) {
            detectLoginStatus(response);
            //showSocial();
        });
    };

    Session.set('social', false);
    Session.set('social', true);
});
function fbInit(){
    var info = {fan: [], group: []};
    FB.api(
        "/me/accounts",
        function (response) {
            if (response && !response.error) {
                //console.log('test:', response);
                //console.log('test2:', response.data[0]);
                var _obj = {};
                _obj.id = response.data[0].id;
                _obj.name = response.data[0].name;
                info.fan.push(_obj);
                show('fan')
            }
        }
    );
    FB.api(
        "/me/groups",
        function (response) {
            if (response && !response.error) {
                //console.log('test:',response);
                //console.log('test2:',response.data[0]);
                var _obj = {};
                _obj.id = response.data[0].id;
                _obj.name = response.data[0].name;
                info.group.push(_obj);
                show('group')
            }
        }
    );
    function show(type) {
        console.log('You have ' + type + ' page');
        info[type].forEach(function (a) {
            console.log(a.name + ' with id ' + a.id);
        });
    }
}
permission = {
    arr: [],
    get: function () {
        FB.api(
            "/" + FB.getUserID() + "/permissions",
            _output = function (response) {
                if (response && !response.error) {
                    var _arr = response.data.map(function (a) {
                        return a.permission
                    });
                    console.log('have permission:', _arr);
                    permission.arr = _arr;
                }
            }
        );
    },
    ask: function () {
        FB.login(function (response) {
            },
            //{perms: 'publish_actions,manage_pages,publish_pages,user_managed_groups'});
            {});
        FB.getLoginStatus(function (response) {
            detectLoginStatus(response);
        });
    },
    del: function () {
        FB.api('/me/permissions', 'delete', function (response) {
            console.log('permission deleted? ', response); // true
            alert('reload');
            location.reload();
        });
    }
};

function detectLoginStatus(response) {
    console.log('response:', response);
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        permission.get();
        FB.api('/me', function (response) {
            console.log('Thanks for logging in, ' + response.name + '!');
            fbInit()
        });
    } else if (response.status === 'not_authorized') {
        //logged into Facebook, but not app.
        console.log('Please log ' + 'into this app.');
    } else {
        // not logged into FB,not sure if logged into this app.
        console.log('Please log ' + 'into Facebook.');
    }
}

Template.fbtest.onCreated(function () {

});
Template.fbtest.helpers({
    social: function () {
        return Session.get('social');
    }
});
Template.fbtest.events({
    'click .addSocial': function () {
        //console.log(info);
        var _sess = !Session.get('social');
        Session.set('social', _sess);
        console.log('sess is ', _sess);

    },
    'click .logout': function () {
        var _link = window.location.href;
        FB.getLoginStatus(function (response) {
            var _token = response.authResponse.accessToken;
            window.location = 'https://www.facebook.com/logout.php?next=' + _link + '&access_token=' + _token;
        });
    },
    'click #message button':function(){
        //,keyup #message input
        //alert();
        //return
        var text=$('#message input').val();
        $('#message input').val('');
        FB.api('/me/feed', 'post', {
            message: text
            //link:YOUR_SITE_URL,
            //picture:picture_url
            //name: 'Post name',
            //description: 'description'
        }, function (data) {
            $('#message .result').html('Have just sent '+text);
            //console.log('profile test:', data);
        });
    },
    'keyup #message input':function(e){
        if(e.keyCode!==13){return}
        //if(e.key)
        //alert('fine');
    }
});