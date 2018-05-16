(function functionName() {
  var menu = document.getElementsByClassName('menu')[0];
  var search = document.getElementsByClassName('search-btn');
  var menuModal = document.getElementsByClassName('menu-dialog')[0];
  var searchModal = document.getElementsByClassName('search-dialog')[0];
  var closeBtn = document.getElementsByClassName('modal-close');
  
  console.log(closeBtn);
  

  function showMoboileMenu() {
    menuModal.style.display = "block";
  }

  function showSearch() {
    searchModal.style.display = "block";
  }

  function closeMobileMenu() {
    menuModal.style.display = "none";
  }

  function closeSearch() {
    searchModal.style.display = "none";
  }



  search[0].addEventListener('click', showSearch, false);
  search[1].addEventListener('click', showSearch, false);
  menu.addEventListener('click', showMoboileMenu, false);
  closeBtn[0].addEventListener('click', closeMobileMenu, false);
  closeBtn[1].addEventListener('click', closeSearch, false);
})();

