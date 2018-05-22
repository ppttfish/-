const getScroll = () => document.documentElement.scrollTop 
                        || document.body.scrollTop;
window.onscroll = (() => {
  let oldScrollTop = getScroll();

  return (scrollTop) => {
    let newScrollTop = getScroll();

    if (oldScrollTop > newScrollTop) {
      console.log('up');
      $('#nav').fadeIn();
      oldScrollTop = newScrollTop;
    } else {
      console.log('down');
      $('#nav').fadeOut();
      oldScrollTop = newScrollTop;
    }
  }
})();

