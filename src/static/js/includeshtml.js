$(function () {
    var includes = $('[data-include]')
    $.each(includes, function () {
        var file = './static/template/' + $(this).data('include') + '.html'
        $(this).load(file)
    })
})