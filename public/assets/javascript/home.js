var that

$('.panel').on('click', '.addComment', function(e){
	that = $(this).siblings('.commentsHolder')
	var dataTest = {}
	var postID = $(this).attr('data')
	var commentText = $(this).siblings('textarea').val()
	console.log('click')
	console.log(postID)
	console.log(commentText)
  
  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/newComment",
    data: {
     id: postID,
     text: commentText
    }
  })

  .done(function(data) {
  	console.log(data)
	that.append('<div class="commentDivider"><p class="comment">'+ data.text + '</p><button class="commentRemove" data="' + data.id + '">&times;</button>')

  }
  );
});