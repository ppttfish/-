let year = [
  {
    title: 'css实例1',
    tags: ['css', 'demo']
  },
  {
    title: 'css实例2',
    tags: ['css', 'demo']
  },
  {
    title: 'flex布局',
    tags: ['css', 'flex']
  },
  {
    title: '三种继承',
    tags: ['js', 'html']
  },

]; 

const ctag = {
  css: 'css',
  demo: 'demo',
  flex: 'flex',
  js: 'js',
  html: 'html'
};

const select = (ctag) => {
  console.log(year.length);
  year.forEach((post) => {
    post.flag = 1;

    //为啥这里只进来两个？？？
    console.log('有几个post ' + post.title);
    
    post.tags.forEach((tag) => {
      console.log('大家都在: ' + post.title);
      if (ctag == tag) {
        console.log('把我设置了：' + post.title);
        post.flag = 0;
      }
    });
    
    if (post.flag) {
      console.log('------post: '+ post.title);
      
      year.splice(year.indexOf(post), 1, 1);
    }
  });
}

select('html')
year.map((post) => {
  
  console.log(post.title);
});

var hasTag = 0;
            post.tags.each(function(tag) {
              if (ctag == tag) {
                hasTag = 1;
              }
            });
            
            if (hasTag) {
              years[year].push(post);
            }