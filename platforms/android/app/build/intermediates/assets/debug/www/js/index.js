
var app = {
    // Application Constructor
    
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        this.logincheck();
    },
    
    
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        document.addEventListener("backbutton", this.ExitDialogPrompt, false);
        
    },
    ExitDialogPrompt:function(){
        navigator.notification.confirm(
            'Are you sure you want to exit?', 
             onConfirm,            
            'Confirm exit',           
            ['Yes','No']     
        );
        function onConfirm(buttonIndex) {
            if (buttonIndex == 1) {
                navigator.app.exitApp();
            }

            else{
                return;
            }
        }

    },
    logincheck:function(){
        if(localStorage.hasOwnProperty('username')){
            $('#main').show();
            $('#logwrapper').hide();

        }
        else{
            $('#logwrapper').show();
            $('#main').hide();
        }
    },
   
   

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

       

    }
};

var Book = function(){

   
    


    function loginHandler(event){
        event.preventDefault();
        $('#loader').show();
        $('#logwrapper').hide();
        var username = $('#username').val();
        var password = $('#password').val();
        var loginajax = "https://script.google.com/macros/s/AKfycby2ItbOduII23T9tG00WhPYdFzSWX3bqROkWp2GyQGDi7fYhN-u/exec?logusername="+username+"&logpass="+password;
        $.post({url:loginajax},function(res){
            var response = JSON.parse(res);
            if(response.status){
                localStorage.setItem("username", username);
                localStorage.setItem("password", password);
                if(!(localStorage.hasOwnProperty('herbs'))){
                    var urlAjax =  "https://script.google.com/macros/s/AKfycbz2Lu5oBt9uSLGmD8GwsiPkn1SH2as299hVW90166_x-6KKyjgZ/exec";
                    $.post({url:urlAjax},function(res){ 
                        localStorage.setItem('herbs',JSON.stringify(res));  
                    });
                }
                $('#loader').hide();
                $('#main').show();
                
            }
            else{
               $('#loginerror').show().fadeOut(3000);
               
            }
        });
    
    }
   
    
    function chnagehandler(e){
        e.preventDefault();
        
        $('#radiolist').empty();
        var input =  $('#searchfield').val();
        var rec = JSON.parse(localStorage.getItem('herbs'));
        rec = JSON.parse(rec);
        input = input.toLowerCase();
       
        var filtered = rec.filter(function(rec){
            var name = rec.UrduEnglishName;
                  if(name && name.length > 1){
                      var lname = name.toLowerCase();
                    return lname.startsWith(input);
                  }
                  else{
                      return "";
                  }
                        
                
            });
            
            var ul = $('#list');
            $('#list').empty();
            
            filtered.forEach((record)=>{
                    ul.append(`<li id="${record.MedicineId}" style="padding: 20px 15px;" class="liClass${record.MedicineId}  list-group-item d-flex justify-content-between">
                    <div id="left" >${record.UrduEnglishName}</div>
                    <div id="right"></i>
                    ${record.UrduName}<img src="www/../img/arrow.png" alt="" width=25; height=25 style="margin-left: 10px;"></div></li>`)
                    $('.liClass'+record.MedicineId).on('click',inputclick);
                    
                })
                

                
                
                if(input == ""){
                    $('#list').empty();
                };
                var count = $("#list").children().length;
                if(!(input == "")){

                    document.getElementById('counts').innerHTML = count;
                    document.getElementById('count-holder').style.display = 'block';
                }
                else{
                    document.getElementById('count-holder').style.display = 'none';
                }
            
            }
             
    function radioHandler(e){
        e.preventDefault();
        document.getElementById('count-holder').style.display = 'none';
        document.getElementById('searchfield').value = '';
        $('#list').empty();
        var radioHotCold = $("input[name='options']:checked").val();
        var radioWetDry = $("input[name='secoptions']:checked").val();
        // { temprament: radioHotCold, temprament: radioWetDry }
        var tempramenturl = "https://script.google.com/macros/s/AKfycbwc-Rk1BNGlPSgWRxV-Ar2bl6nvluXQTjIP9X_tVW2t218Epuc/exec?temprament="+radioHotCold+" "+radioWetDry;
        $.post({url:tempramenturl},function(res){
            var items = JSON.parse(res);
            var ul = $('#radiolist');
            $('#radiolist').empty();

            
            
            items.forEach((item)=>{
                
                    ul.append(`<li id="${item.MedicineID}" style="padding: 20px 15px;" class="liClass${item.MedicineID} list-group-item d-flex justify-content-between">
                    <div id="left" style="color:#000">${item.searchName}</div>
                    <div id="right"></i><span style="color:#000">${item.urduName}<span>
                    <img src="www/../img/arrow.png" id="deatilbtn" alt="" width=25; height=25 style="margin-left:10px;"></div></li>`
                    )
                    $('.liClass'+item.MedicineID).on('click',radionclick);
                })
               
                

        });
    }
   

        function inputclick(e){
            e.preventDefault()
            $('#exampleModal').hide(); 
            
            $('body').removeClass('modal-open'); 
            $('.modal-backdrop').remove();
            $('.spin').show();
            var idd = $(this).attr('id');
            
            var singleresult = "https://script.google.com/macros/s/AKfycbwD44DEpkDD1nmEU6T1r9Ui6Eq5nYvWf1e7waU8QeuvE65DolJz/exec";
           
            $.post({url:singleresult},{"MedicineID": idd},function(res){
                
                var parsed = JSON.parse(res);
                
                if(parsed){
                $('#exampleModalLabel').html(parsed.searchName);
                $('.UrduName').html(parsed.urduName);
                $('.botanic').html(parsed.botanicName);
                $('.Othername').html(parsed.otherName);
                $('.Temprament').html(parsed.temprament);
                $('.usage').html(parsed.usage);
                $('.harmful').html(parsed.harmfull);
                $('.correction').html(parsed.correction);
                $('.qualitynature').html(parsed.qualityNature);
                $('#exampleModal').modal('hide');
                $('.spin').hide();
                $('#exampleModal').modal('show');
                }
               
                
                
                
                
                
               
               
            });
           
        }
        function radionclick(e){
            e.preventDefault()
            
            $('#spinner').show();
            var idd = $(this).attr('id');
            
            var singleresult = "https://script.google.com/macros/s/AKfycbwD44DEpkDD1nmEU6T1r9Ui6Eq5nYvWf1e7waU8QeuvE65DolJz/exec";
           
            $.post({url:singleresult},{"MedicineID": idd},function(res){
                var parsed = JSON.parse(res);
                console.log(parsed);
               
                
                
                $('#exampleModalLabel').html(parsed.searchName);
                $('.UrduName').html(parsed.urduName);
                $('.botanic').html(parsed.botanicName);
                $('.Othername').html(parsed.otherName);
                $('.Temprament').html(parsed.temprament);
                $('.usage').html(parsed.usage);
                $('.harmful').html(parsed.harmfull);
                $('.correction').html(parsed.correction);
                $('.qualitynature').html(parsed.qualityNature);
                $('#spinner').hide();
                $('#exampleModal').modal('show');
                
                
               
               
            });
           
        }

       
    function logout(e){
            e.preventDefault();
            localStorage.clear();

            $('#logwrapper').show();
            $('#main').hide();
    }

    

    return {
        setupEvents:()=>{
            
            $('#loginBtn').on('click',loginHandler);
            $('#radiosearchbtn').on('click',radioHandler);
            $('#searchfield').on('keyup',chnagehandler);
            $('#logoutlink').on('click',logout);

           
            
            
        }
    }
}
app.initialize();

var appbook = new Book();
document.addEventListener("DOMContentLoaded", function(event) {
    appbook.setupEvents();
    
  });
