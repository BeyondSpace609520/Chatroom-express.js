var commentCount = 0;

$(document).ready(function() {
	$("#articleContent").html(article.content);

	article.comments.forEach(function(comment){
		addComment(comment);
		commentCount ++;
	})
	$('#commentCount').text(commentCount);

	if(article.filePath)
	{
		var attachedFile = $('<a></a>').append(article.fileName)
			.attr('href', '/uploads/blog/' + article.filePath).attr('download', article.fileName);
		$('#fileAppend').append(attachedFile);
	}
});

function addComment(comment)
{
	var commentItem = $('<div class="commentItem"></div>');
	var avatar = $('<img/>').attr('class', 'img-circle').attr('src', '/images/avatar/1.jpg')
					.attr('height', '65').attr('width', '65').attr('alt', 'Avatr');
	var imgCol = $('<div class="col-sm-2 text-center"></div>');
	imgCol.append(avatar);

	var textCol = $('<div class="col-sm-10"></div>');
	var commentHeading = $('<h4>');
	commentHeading.append(comment.author + ' ');

	var postTime = $('<small></small>')
	postTime.append(comment.postTime);
	commentHeading.append(postTime);

	var commentText = $('<p></p>');
	commentText.append(comment.content);
	commentText.append('<hr>');

	textCol.append(commentHeading);
	textCol.append(commentText);

	commentItem.append(imgCol);
	commentItem.append(textCol);
	$('#commentContent').append(commentItem);
}

function onSubmitComment()
{
	var commentText = $("#commentText").val();
	$.ajax({
		url: '/blog/' + article._id + '/detail',
		type: "POST",
		data: { content: commentText } 
	});

	var comment = {};
	comment.postTime = new Date().toLocaleString();
	comment.author = article.author;
	comment.content = commentText;

	addComment(comment);
	 
	commentCount ++;
	$('#commentCount').text(commentCount);
}