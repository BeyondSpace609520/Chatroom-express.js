$(document).ready(function () {
  fileIsSelected();
  $("#txtEditor").Editor();
});

function fileIsSelected() {
  $('input[type=file]').on('change', function () {
    var file = this.files[0];
    if (file.size > 15 * 1024 * 1024) {
      alert('max upload size is 15 MB');
    } else {
      var reader = new FileReader();
      reader.addEventListener("load", function () {
        ajaxFileUpload(file.name, reader.result.split(',')[1]);
      }, false);
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  });
}
function sendData(){
  $.ajax({
    url: "/blog/create",
    type: "POST",
    data: { content: $("#txtEditor").Editor('getText'),
        cateogry: $('#blogCategories').val(),
        title: $('#title').val(),
        filePath: $('input[type=file]')[0].files[0].name}
  });
}
function ajaxFileUpload(fileName, fileData) {
  var message = {};
  var formData = new FormData();
  formData.append('fileName', fileName);
  formData.append("fileToUpload", fileData);

  $.ajax({
    url: "/blog-file-upload",
    type: "POST",
    data: formData,
    contentType: false,
    processData: false,
    success: function (response) {
      if (response.filePath) {

      } else {
        throw 'File upload failed';
      }
    },
    error: function (jqXHR, textStatus, errorMessage) {
      alert('Error in sending attachment: ' + errorMessage); // Optional
    }
  });
}