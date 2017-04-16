$(document).ready(() => {
  $('delete-project').on('click', () => {
    let id = $(this).data('id');
    let url = '/admin/delete/' + id;
    if (confirm('Delete Project?')) {
      $.ajax({
        url: url,
        type: 'DELETE',
        success: (result) => {
          window.location = '/admin';
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  });
});
