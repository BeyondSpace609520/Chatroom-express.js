var socket = io();

$(document).ready(function () {
	console.log(user_list);
	console.log(blog_list);
	showUserTable(user_list);
	showArticleTable(blog_list);
	$('#mainTable1').dataTable();
	$('#mainTable2').dataTable();
});

function showUserTable(userList)
{
	$("#userTable").html('');
	userList.forEach(function(user){
		appendUserTableRow(user);
	});
}
function appendUserTableRow(user)
{
	var trElement = '', tdElement = '', avatarElement='', linkElement='';

	trElement = $("<tr></tr>");
	tdElement = $("<td></td>").text(user.username);
	trElement.append(tdElement);

	tdElement = $("<td></td>").text(user.email);
	trElement.append(tdElement);
	
	tdElement = $("<td></td>");
	if(user.status === 'connect')
		avatarElement = $("<img />").attr("src", "images/online.jpg").attr("class", "statusAvatar")
									.attr("data-toggle", "tooltip").attr("title", "User is online");
	if(user.status === 'disconnect')
		avatarElement = $("<img />").attr("src", "images/offline.jpg").attr("class", "statusAvatar")
									.attr("data-toggle", "tooltip").attr("title", "User is offline");
	tdElement.append(avatarElement);
	trElement.append(tdElement);

	tdElement = $("<td></td>");
	if(user.verify === 'allow')
		avatarElement = $("<img />").attr("src", "images/verified.jpg").attr("class", "statusAvatar")
									.attr("data-toggle", "tooltip").attr("title", "User is allowed");
	if(user.verify === 'not allow')
		avatarElement = $("<img />").attr("src", "images/noverified.jpg").attr("class", "statusAvatar")
									.attr("data-toggle", "tooltip").attr("title", "User is not allowed");
	tdElement.append(avatarElement);
	trElement.append(tdElement);

	tdElement = $("<td></td>").text(user.role);
	trElement.append(tdElement);

	tdElement = $("<td></td>");
	if(user.verify === 'not allow')
	{
		linkElement = $("<a></a>").attr("href", "/dashboard/" + user._id + "/allow").attr("style", "margin-left: 15px;")
					.attr("data-toggle", "tooltip").attr("title", "Allow User");
		avatarElement = $("<img />").attr("src", "images/allow.jpg").attr("class", "statusAvatar");
		linkElement.append(avatarElement);
		tdElement.append(linkElement);

		linkElement = $("<a></a>").attr("href", "/dashboard/" + user._id + "/delete").attr("style", "margin-left: 15px;")
					.attr("data-toggle", "tooltip").attr("title", "Delete User");
		avatarElement = $("<img />").attr("src", "images/trash.jpg").attr("class", "statusAvatar");
		linkElement.append(avatarElement);
		tdElement.append(linkElement);
	}
	if(user.verify === 'allow')
	{
		linkElement = $("<a></a>").attr("href", "/dashboard/" + user._id + "/disallow").attr("style", "margin-left: 15px;")
					.attr("data-toggle", "tooltip").attr("title", "Disallow User");
		avatarElement = $("<img />").attr("src", "images/disallow.jpg").attr("class", "statusAvatar");
		linkElement.append(avatarElement);
		tdElement.append(linkElement);

		linkElement = $("<a></a>").attr("href", "/dashboard/" + user._id + "/delete").attr("style", "margin-left: 15px;")
					.attr("data-toggle", "tooltip").attr("title", "Delete User");
		avatarElement = $("<img />").attr("src", "images/trash.jpg").attr("class", "statusAvatar");
		linkElement.append(avatarElement);
		tdElement.append(linkElement);
	}
	
	trElement.append(tdElement);

	$("#userTable").append(trElement);
}

function showArticleTable(blogList)
{
	$("#articleTable").html('');
	blogList.forEach(function(article){
		appendArticleTableRow(article);
	});
}
function appendArticleTableRow(article)
{
	var trElement = '', tdElement = '';

	trElement = $("<tr></tr>");
	tdElement = $("<td></td>").text(article.title);
	trElement.append(tdElement);

	tdElement = $("<td></td>").text(article.cateogry);
	trElement.append(tdElement);

	tdElement = $("<td></td>").text(article.author);
	trElement.append(tdElement);

	tdElement = $("<td></td>").text(article.postTime);
	trElement.append(tdElement);

	tdElement = $("<td></td>").text('verified');
	trElement.append(tdElement);

	tdElement = $("<td></td>").text('will be');
	trElement.append(tdElement);

	$("#articleTable").append(trElement);
}
/*---------- Socket ----------*/
socket.on('newRegister', function (newRigstUser) {
	var flag = 1;
	user_list.forEach(function (user) {
		if(user.username === newRigstUser.username)
			flag = 0;
	});
	if(flag == 1)
		appendUserTableRow(newRigstUser);
});