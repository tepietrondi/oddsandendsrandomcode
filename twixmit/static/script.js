function twixmitMainReady(){
    window.saveResultsDom = $("#save-results");
    window.textToSave = $("#text-to-save");
    window.postButton = $("button#post");
    
    window.yoursPendingList = $("ul#yours-pending");
    window.theirsPendingList = $("ul#theirs-pending");
    window.postBoxToClone = $("li#cloneme");
    
    postButton.click(savePostForMix);
    
    loadYoursPending();
    loadTheirsPending();
}

function loadPostsAll(which,cursorWindowKey,prependToList,noPostsText){
    var options = {
        dataType : "json",
        data : {"which" : which ,"since" : window[cursorWindowKey] },
        success : function(data, textStatus, jqXHR){
            window[cursorWindowKey] = data.c;
            
            if( data.r.length > 0){
                for( result in data.r){
                    var liDom = postBoxToClone.clone();
                    liDom.children(".text").text(data.r[result].text);
                    liDom.children(".time").text(data.r[result].created);
                    liDom.removeAttr("id");
                    liDom.show();
                    liDom.prependTo(prependToList);
                }
            } else {
                var liDom = postBoxToClone.clone();
                liDom.children(".text").text(noPostsText);
                liDom.show();
                liDom.prependTo(prependToList);
            }
        },
        error : function(jqXHR, textStatus, errorThrown){
            console.error(errorThrown);                  
        },
        url : "/getposts",
        type : "get"
    };
    
    $.ajax(options);

}

function loadYoursPending(){   
    loadPostsAll("yours-pending","yoursPendingListCursor",yoursPendingList,"You have no pending posts, share something!");
}

function loadTheirsPending(){
    loadPostsAll("theirs-pending","theirsPendingListCursor",theirsPendingList,"They have no pending posts, tell them to share something!");
}   
    
function savePostForMix(e){
    var options = {
        dataType : "json",
        data : {"text" : textToSave.val() },
        success : function(data, textStatus, jqXHR){
                
            if (data && data.success == true){
                saveResultsDom.css("color","green").css("font-weight","bold");
                saveResultsDom.text("Saved!");
            } else if (data){
                saveResultsDom.css("color","red").css("font-weight","bold");
                saveResultsDom.text(data.failure_message);
            } else {
                saveResultsDom.css("color","red").css("font-weight","bold");
                saveResultsDom.text(textStatus);
            }
        },
        error : function(jqXHR, textStatus, errorThrown){
                saveResultsDom.css("color","red").css("font-weight","bold");
                saveResultsDom.text(errorThrown);
        },
        url : "/saveformix",
        type : "post",
        beforeSend : function(jqXHR, settings){
            postButton.attr("disabled","disabled");
        },
        complete: function(jqXHR, textStatus){
            postButton.removeAttr("disabled");
        }
    };
    
    $.ajax(options);
}