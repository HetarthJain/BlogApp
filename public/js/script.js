document.addEventListener('DOMContentLoaded', function () {
	console.log("dom loaded")
	const allButtons = document.querySelectorAll('.searchBtn')
	const searchBar = document.querySelector('.searchBar')
	const searchInput = document.getElementById('searchInput')
	const searchClose = document.getElementById('searchClose')
	console.log(searchBar)
	console.log("searchclose is ",searchClose)

	for (var i = 0; i < allButtons.length; i++) {
		console.log("all buttons is ",allButtons[i])
		allButtons[i].addEventListener('click', function(){
			searchBar.style.visiblity = 'visible'
			searchBar.classList.add('open')
			console.log(this)
			this.setAttribute('aria-expanded', 'true')
			searchInput.focus()
		})
	}
	if (searchClose) {
		searchClose.addEventListener("click", function () {
			searchBar.style.visiblity = 'hidden'
			searchBar.classList.remove('open')
			this.setAttribute('aria-expanded', 'false')
		})
	}
})