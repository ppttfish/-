(function functionName() {
  var menu = document.getElementsByClassName('menu')[0];
  var search = document.getElementsByClassName('search-btn');
  var menuModal = document.getElementsByClassName('menu-dialog')[0];
  var searchModal = document.getElementsByClassName('search-dialog')[0];
  var closeBtn = document.getElementsByClassName('modal-close');
  var returnTop = document.getElementById('return-top');
  var navContainer = document.getElementsByClassName('nav-container')[0];
  
  const getScollTop= () => document.documentElement.scrollTop || document.body.scrollTop;

  // 回到顶部
  window.onscroll = function() {
    var scrollTop = getScollTop(); 
   
    return function() { //闭包保留上次的滚动值 来实现下滑隐藏导航 上滑出现导航
      var windowWidth = window.screen.availWidth;

      if (scrollTop > getScollTop()) {
        $(navContainer).fadeIn();
        scrollTop = getScollTop();
      } else if(scrollTop < getScollTop() && (windowWidth > 1200) && (getScollTop() > 110)) {
        $(navContainer).fadeOut();
        scrollTop = getScollTop();
      } else {
        scrollTop = getScollTop();
      }

      // returnTop.style.display = scrollTop > 500 ? 'block' : 'none';
      if (scrollTop > 500) {
        $(returnTop).fadeIn();
      } else {
        $(returnTop).fadeOut()
      }
      
      if (windowWidth < 1200) {
        if (scrollTop >= 522) {
          navContainer.style.background = '#fff';
          navContainer.style.color = 'black';
        }
        if (scrollTop < 522 ) {
          navContainer.style.background = 'transparent';
        }
      }
    } 
  }();

  returnTop.onclick = function () {
    // scrollToptimer = setInterval(function () {
    //   var top = document.body.scrollTop || document.documentElement.scrollTop;
    //   var speed = top / 1.5;
    //   if (document.body.scrollTop!=0) {
    //       document.body.scrollTop -= speed;
    //   }else {
    //       document.documentElement.scrollTop -= speed;
    //   }
    //   if (top == 0) {
    //       clearInterval(scrollToptimer);
    //   }
    // }, 30); 
    $("html, body").animate({ scrollTop: 0 }, 120);
  }


  function showMoboileMenu() {
    menuModal.style.display = 'block';
  }

  function showSearch() {
    searchModal.style.display = 'block';
  }

  function closeMobileMenu() {
    menuModal.style.display = 'none';
  }

  function closeSearch() {
    searchModal.style.display = 'none';
  }

  search[0].addEventListener('click', showSearch, false);
  search[1].addEventListener('click', showSearch, false);
  menu.addEventListener('click', showMoboileMenu, false);
  closeBtn[0].addEventListener('click', closeMobileMenu, false);
  closeBtn[1].addEventListener('click', closeSearch, false);

  console.log('你，\n一会看我，\n一会看云，\n我觉得，\n你看我时很远，\n你看云时很近\n');
})();

