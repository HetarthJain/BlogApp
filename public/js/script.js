document.addEventListener('DOMContentLoaded', function () {
	const allButtons = document.querySelectorAll('.searchBtn')
	const searchBar = document.querySelector('.searchBar')
	const searchInput = document.getElementById('searchInput')
	const searchClose = document.getElementById('searchClose')

	for (var i = 0; i < allButtons.length; i++) {
		allButtons[i].addEventListener('click', function(){
			searchBar.style.visiblity = 'visible'
			searchBar.classList.add('open')
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

document.addEventListener('DOMContentLoaded', () => {
	const replyHeaders = document.querySelectorAll('.reply-h');
  
	replyHeaders.forEach(replyHeader => {
	  replyHeader.addEventListener('click', () => {
		const formGroup = replyHeader.nextElementSibling; // Get the next sibling element with classname "form-group"
		formGroup.style.display = formGroup.style.display === 'none' ? 'block' : 'none'; // Toggle the display property
	  });
	});
  });