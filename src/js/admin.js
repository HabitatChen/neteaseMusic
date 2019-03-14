console.log($)
$('.song-item-detail').on('click', function (e) {
  var siblings = e.currentTarget.parentNode.children
  var index = e.currentTarget.firstChild.nextSibling.innerText - 0

  $(e.currentTarget).addClass('active')
      .siblings().removeClass('active')

  for (var i = 0; i < siblings.length; i++) {
    let tempIndex = i + 1
    if (tempIndex !== index) {
      $('#menu-' + tempIndex).removeClass('active')
    }else {
      $('#menu-' + tempIndex).addClass('active')
    }
  }
})