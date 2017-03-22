var thisHolder

$('.panel').on('click', '.addComment', function(){
	thisHolder = $(this).parents('.addCommentContainer').siblings('.commentsHolder')
	var postID = $(this).attr('data')
	var commentText = $(this).siblings('textarea').val()
  
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
	thisHolder.append('<div class="commentDivider"><p class="comment">'+ data.text + '</p><button class="commentRemove" data="' + data.id + '">&times;</button>')

  }
  );
  $(this).siblings('textarea').val('Add a comment')
});

$('.panel').on('click', '.commentRemove', function(){
	var that = $(this)
	var commentID = $(this).attr('data')
  console.log(commentID)
	  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/deleteComment",
    data: {
     id: commentID,
    }
  })

  .done(function(data) {
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
	
	if ($(this).text() === 'SHOW COMMENTS'){
		$(this).text('HIDE COMMENTS')
	} else {
		$(this).text('SHOW COMMENTS')
	}
})

