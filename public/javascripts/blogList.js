$(document).ready(function() {
	let link='', articleTitle='', articleContent='', articlePostData='', clockIcon='';

	blogList.forEach(function(article){
		link = $('<a class="blogLink"></a>');
		link.attr('href', '/blog/' + article._id + '/detail');
		
		card = $('<div class="card"></div>');
		articleTitle = $('<h3>').append(article.title);
		articleContent = $('<div class="wrapPanel previewPanel"></div>').html(article.content);
		clockIcon = $('<span class="glyphicon glyphicon-time"></span>');
		articlePostData = $('<h5>');
		articlePostData.append(clockIcon);
		articlePostData.append(' Posted By ' + article.author + ', ' + article.postTime);

		card.append(articleTitle);
		card.append(articlePostData);
		card.append(articleContent);
		link.append(card);

		if(article.cateogry === 'Science')
			$('#science').prepend(link);
		if(article.cateogry === 'Sport')
			$('#sport').prepend(link);
		if(article.cateogry === 'Music')
			$('#music').prepend(link);
	});

	blogList.forEach(function(article){
		link = $('<a class="blogLink"></a>');
		link.attr('href', '/blog/' + article._id + '/detail');
		
		card = $('<div class="card"></div>');
		articleTitle = $('<h3>').append(article.title);
		articleContent = $('<div class="wrapPanel previewPanel"></div>').html(article.content);
		clockIcon = $('<span class="glyphicon glyphicon-time"></span>');
		articlePostData = $('<h5>');
		articlePostData.append(clockIcon);
		articlePostData.append(' Posted By ' + article.author + ', ' + article.postTime);

		card.append(articleTitle);
		card.append(articlePostData);
		card.append(articleContent);
		link.append(card);

		$('#total').prepend(link);
	});

});