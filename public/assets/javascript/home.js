var that

$('.panel').on('click', '.addComment', function(){
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
  $(this).siblings('textarea').val('Add a comment')
});

$('.panel').on('click', '.commentRemove', function(){
	var that = $(this)
	var commentID = $(this).attr('data')
	  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/deleteComment",
    data: {
     id: commentID,
    }
  })

  .done(function(data) {
  	console.log(data)
  that.parents('.commentDivider').remove()

  }
  );
});

$('.panel').on('focus', 'textarea', function(){
$(this).val('')
	})

$('.panel').on('click', '.showComments', function(){
	$(this).parents('.panel').find('.commentsHolder').slideToggle()
	$(this).parents('.panel').find('.addCommentContainer').slideToggle()
})

